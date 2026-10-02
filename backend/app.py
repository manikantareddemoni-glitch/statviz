from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import uuid
import os
import traceback

from services.data_service import (
    get_sample_list,
    load_sample_dataset,
    parse_csv_content,
    inspect_dataset,
    clean_dataset,
    get_paginated_preview,
    SAMPLE_DATASETS
)
from services.frequency_service import generate_frequency_distribution
from services.stats_service import calculate_descriptive_statistics
from services.ogive_service import generate_ogive_data
from services.stem_leaf_service import generate_stem_and_leaf
from services.chebyshev_service import calculate_chebyshev_inequality
from services.normality_service import calculate_normality_analysis
from services.skewness_service import calculate_skewness_analysis
from services.scatter_service import calculate_scatter_and_regression
from services.report_service import generate_summary_report

app = Flask(__name__)
# Enable CORS for all routes and origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

# In-memory storage for uploaded datasets: { dataset_id: { id, name, df, filename, upload_time, ... } }
DATASET_STORE = {}

def get_df_from_request(req):
    """Retrieve DataFrame from store by dataset_id or fallback to request body data."""
    data = req.get_json(silent=True) or {}
    dataset_id = data.get("dataset_id") or req.args.get("dataset_id")
    
    if dataset_id and dataset_id in DATASET_STORE:
        return DATASET_STORE[dataset_id]["df"]
    
    # Check if raw records are provided in body
    if "records" in data and isinstance(data["records"], list):
        return pd.DataFrame(data["records"])
        
    # Default fallback to first uploaded dataset if any
    if DATASET_STORE:
        first_key = list(DATASET_STORE.keys())[-1] # most recent
        return DATASET_STORE[first_key]["df"]
        
    raise ValueError("No active dataset found. Please upload a CSV file first.")

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "service": "StatViz API",
        "version": "1.0.0",
        "loaded_datasets_count": len(DATASET_STORE)
    })

@app.route("/api/samples", methods=["GET"])
def list_samples():
    """Return empty samples list since app is 100% user-upload-first."""
    return jsonify({"success": True, "samples": []})

@app.route("/api/datasets", methods=["GET"])
def list_datasets():
    """List all user-uploaded datasets in memory."""
    items = []
    for d_id, d_data in DATASET_STORE.items():
        df = d_data["df"]
        num_cols = list(df.select_dtypes(include=[np.number]).columns)
        items.append({
            "id": d_id,
            "name": d_data["name"],
            "total_rows": int(len(df)),
            "total_columns": int(len(df.columns)),
            "numeric_columns": num_cols,
            "numeric_column_count": len(num_cols)
        })
    return jsonify({"success": True, "datasets": items})

@app.route("/api/dataset/<dataset_id>", methods=["GET"])
def get_dataset(dataset_id):
    """Get inspection and preview for an existing uploaded dataset."""
    try:
        if dataset_id not in DATASET_STORE:
            return jsonify({"success": False, "error": f"Dataset '{dataset_id}' not found."}), 404
        
        df = DATASET_STORE[dataset_id]["df"]
        inspection = inspect_dataset(df)
        preview = get_paginated_preview(df, page=1, page_size=15)
        
        recommended_x = inspection["numeric_columns"][0] if inspection["numeric_columns"] else None
        recommended_y = inspection["numeric_columns"][1] if len(inspection["numeric_columns"]) > 1 else recommended_x

        return jsonify({
            "success": True,
            "dataset_id": dataset_id,
            "name": DATASET_STORE[dataset_id]["name"],
            "recommended_x": recommended_x,
            "recommended_y": recommended_y,
            "inspection": inspection,
            "preview": preview
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/dataset/<dataset_id>", methods=["DELETE"])
def delete_dataset(dataset_id):
    """Delete an uploaded dataset from store."""
    if dataset_id in DATASET_STORE:
        del DATASET_STORE[dataset_id]
        return jsonify({"success": True, "message": f"Dataset '{dataset_id}' deleted."})
    return jsonify({"success": False, "error": f"Dataset '{dataset_id}' not found."}), 404

def pick_recommended_columns(numeric_cols):
    if not numeric_cols:
        return None, None
    non_id = [c for c in numeric_cols if not (c.lower().endswith('id') or c.lower().endswith('index') or c.lower().startswith('id') or c.lower() in ['id', 'slno', 'sl_no', 'sno', 'row_number'])]
    pool = non_id if non_id else numeric_cols
    rec_x = pool[0]
    rec_y = pool[1] if len(pool) > 1 else (numeric_cols[1] if len(numeric_cols) > 1 else rec_x)
    return rec_x, rec_y

@app.route("/api/upload", methods=["POST"])
def upload_dataset():
    try:
        if "file" not in request.files:
            return jsonify({"success": False, "error": "No file uploaded."}), 400
        
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"success": False, "error": "Empty filename."}), 400

        content = file.read().decode("utf-8", errors="replace")
        df = parse_csv_content(content)
        
        if df.empty:
            return jsonify({"success": False, "error": "Uploaded CSV file is empty."}), 400

        dataset_id = f"custom_{uuid.uuid4().hex[:8]}"
        name = file.filename.rsplit(".", 1)[0].replace("_", " ").title()

        DATASET_STORE[dataset_id] = {
            "id": dataset_id,
            "name": name,
            "df": df,
            "is_sample": False
        }

        inspection = inspect_dataset(df)
        preview = get_paginated_preview(df, page=1, page_size=15)

        recommended_x, recommended_y = pick_recommended_columns(inspection["numeric_columns"])

        return jsonify({
            "success": True,
            "dataset_id": dataset_id,
            "name": name,
            "recommended_x": recommended_x,
            "recommended_y": recommended_y,
            "inspection": inspection,
            "preview": preview
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/upload_text", methods=["POST"])
def upload_dataset_text():
    try:
        data = request.get_json() or {}
        content = data.get("csv_text", "").strip()
        name = data.get("name", "").strip() or "Pasted Dataset"

        if not content:
            return jsonify({"success": False, "error": "CSV text content is empty."}), 400

        df = parse_csv_content(content)
        if df.empty:
            return jsonify({"success": False, "error": "Parsed CSV data contains 0 rows."}), 400

        dataset_id = f"custom_{uuid.uuid4().hex[:8]}"

        DATASET_STORE[dataset_id] = {
            "id": dataset_id,
            "name": name,
            "df": df,
            "is_sample": False
        }

        inspection = inspect_dataset(df)
        preview = get_paginated_preview(df, page=1, page_size=15)

        recommended_x, recommended_y = pick_recommended_columns(inspection["numeric_columns"])

        return jsonify({
            "success": True,
            "dataset_id": dataset_id,
            "name": name,
            "recommended_x": recommended_x,
            "recommended_y": recommended_y,
            "inspection": inspection,
            "preview": preview
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/preview", methods=["POST"])
def preview_dataset():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        page = int(data.get("page", 1))
        page_size = int(data.get("page_size", 15))
        
        preview = get_paginated_preview(df, page=page, page_size=page_size)
        inspection = inspect_dataset(df)

        return jsonify({
            "success": True,
            "inspection": inspection,
            "preview": preview
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/clean", methods=["POST"])
def clean_data_route():
    try:
        data = request.get_json() or {}
        dataset_id = data.get("dataset_id")
        strategy = data.get("strategy", "drop") # 'drop' or 'mean'
        columns = data.get("columns", None)

        if not dataset_id or dataset_id not in DATASET_STORE:
            return jsonify({"success": False, "error": "Invalid or missing dataset_id."}), 400

        df_orig = DATASET_STORE[dataset_id]["df"]
        df_clean = clean_dataset(df_orig, strategy=strategy, target_columns=columns)
        
        # Update store with cleaned dataset
        DATASET_STORE[dataset_id]["df"] = df_clean

        inspection = inspect_dataset(df_clean)
        preview = get_paginated_preview(df_clean, page=1, page_size=15)

        return jsonify({
            "success": True,
            "message": f"Successfully applied '{strategy}' missing value treatment.",
            "inspection": inspection,
            "preview": preview
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/frequency", methods=["POST"])
def frequency_analysis():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        column = data.get("column")
        num_classes = data.get("num_classes")
        class_width = data.get("class_width")

        if not column or column not in df.columns:
            return jsonify({"success": False, "error": f"Column '{column}' not found."}), 400

        result = generate_frequency_distribution(df[column], num_classes=num_classes, class_width=class_width)
        return jsonify({"success": True, "column": column, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/descriptive", methods=["POST"])
def descriptive_statistics():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        column = data.get("column")

        if not column or column not in df.columns:
            return jsonify({"success": False, "error": f"Column '{column}' not found."}), 400

        result = calculate_descriptive_statistics(df[column])
        return jsonify({"success": True, "column": column, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/ogive", methods=["POST"])
def ogive_curves():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        column = data.get("column")
        num_classes = data.get("num_classes")

        if not column or column not in df.columns:
            return jsonify({"success": False, "error": f"Column '{column}' not found."}), 400

        result = generate_ogive_data(df[column], num_classes=num_classes)
        return jsonify({"success": True, "column": column, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/stem-and-leaf", methods=["POST"])
def stem_and_leaf_plot():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        column = data.get("column")
        leaf_unit = data.get("leaf_unit")
        split_stems = bool(data.get("split_stems", False))

        if not column or column not in df.columns:
            return jsonify({"success": False, "error": f"Column '{column}' not found."}), 400

        result = generate_stem_and_leaf(df[column], leaf_unit=leaf_unit, split_stems=split_stems)
        return jsonify({"success": True, "column": column, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/chebyshev", methods=["POST"])
def chebyshev_inequality():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        column = data.get("column")
        k = float(data.get("k", 2.0))
        num_bins = int(data.get("num_bins", 15))

        if not column or column not in df.columns:
            return jsonify({"success": False, "error": f"Column '{column}' not found."}), 400

        result = calculate_chebyshev_inequality(df[column], k=k, num_bins=num_bins)
        return jsonify({"success": True, "column": column, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/normality", methods=["POST"])
def normality_analysis():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        column = data.get("column")
        num_bins = int(data.get("num_bins", 15))

        if not column or column not in df.columns:
            return jsonify({"success": False, "error": f"Column '{column}' not found."}), 400

        result = calculate_normality_analysis(df[column], num_bins=num_bins)
        return jsonify({"success": True, "column": column, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/skewness", methods=["POST"])
def skewness_analysis():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        column = data.get("column")

        if not column or column not in df.columns:
            return jsonify({"success": False, "error": f"Column '{column}' not found."}), 400

        result = calculate_skewness_analysis(df[column])
        return jsonify({"success": True, "column": column, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/scatter", methods=["POST"])
def scatter_analysis():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        x_col = data.get("x_column")
        y_col = data.get("y_column")

        if not x_col or x_col not in df.columns:
            return jsonify({"success": False, "error": f"X column '{x_col}' not found."}), 400
        if not y_col or y_col not in df.columns:
            return jsonify({"success": False, "error": f"Y column '{y_col}' not found."}), 400

        result = calculate_scatter_and_regression(df[x_col], df[y_col], x_name=x_col, y_name=y_col)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

@app.route("/api/report", methods=["POST"])
def report_analysis():
    try:
        data = request.get_json() or {}
        df = get_df_from_request(request)
        primary_col = data.get("primary_column")
        secondary_col = data.get("secondary_column")

        if not primary_col or primary_col not in df.columns:
            return jsonify({"success": False, "error": f"Primary column '{primary_col}' not found."}), 400

        result = generate_summary_report(df, primary_col=primary_col, secondary_col=secondary_col)
        return jsonify({"success": True, "data": result})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
