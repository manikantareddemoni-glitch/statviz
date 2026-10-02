import pandas as pd
import numpy as np
import os
import io

SAMPLES_DIR = os.path.join(os.path.dirname(__file__), "..", "data")

SAMPLE_DATASETS = {
    "student_marks": {
        "id": "student_marks",
        "name": "Student Exam Performance",
        "description": "Exam marks in Math, Science, and English alongside study hours and attendance for 100 students.",
        "filename": "student_marks.csv",
        "recommended_x": "Study_Hours",
        "recommended_y": "Math_Score"
    },
    "heights_weights": {
        "id": "heights_weights",
        "name": "Adult Body Measurements",
        "description": "Heights, weights, BMI, age, and activity hours of 120 adult individuals.",
        "filename": "heights_weights.csv",
        "recommended_x": "Height_cm",
        "recommended_y": "Weight_kg"
    },
    "daily_temperatures": {
        "id": "daily_temperatures",
        "name": "Daily Weather & Temperatures",
        "description": "90-day meteorological records with temperatures, humidity, wind speeds, and pressure.",
        "filename": "daily_temperatures.csv",
        "recommended_x": "Avg_Temperature_C",
        "recommended_y": "Humidity_Percent"
    }
}

def get_sample_list():
    """Return list of sample dataset metadata."""
    return list(SAMPLE_DATASETS.values())

def load_sample_dataset(sample_id: str) -> pd.DataFrame:
    """Load a built-in sample dataset by ID."""
    if sample_id not in SAMPLE_DATASETS:
        raise ValueError(f"Unknown sample dataset: {sample_id}")
    filepath = os.path.join(SAMPLES_DIR, SAMPLE_DATASETS[sample_id]["filename"])
    return pd.read_csv(filepath)

def parse_csv_content(content_str: str) -> pd.DataFrame:
    """Parse CSV text into a pandas DataFrame."""
    try:
        return pd.read_csv(io.StringIO(content_str))
    except Exception as e:
        raise ValueError(f"Failed to parse CSV: {str(e)}")

def inspect_dataset(df: pd.DataFrame) -> dict:
    """Inspect dataframe structure, column types, missing values, and summary info."""
    total_rows, total_cols = df.shape
    columns_info = []

    for col in df.columns:
        series = df[col]
        non_null = series.dropna()
        missing_count = int(series.isna().sum())
        missing_pct = round((missing_count / total_rows) * 100, 2) if total_rows > 0 else 0
        unique_count = int(series.nunique())

        is_numeric = pd.api.types.is_numeric_dtype(series)
        
        col_type = "numeric" if is_numeric else ("datetime" if pd.api.types.is_datetime64_any_dtype(series) else "categorical")
        
        col_summary = {
            "name": col,
            "type": col_type,
            "is_numeric": is_numeric,
            "missing_count": missing_count,
            "missing_pct": missing_pct,
            "unique_count": unique_count,
            "sample_values": series.dropna().head(3).tolist()
        }

        if is_numeric and len(non_null) > 0:
            col_summary["min"] = float(round(non_null.min(), 4))
            col_summary["max"] = float(round(non_null.max(), 4))
            col_summary["mean"] = float(round(non_null.mean(), 4))
            col_summary["std"] = float(round(non_null.std(ddof=1), 4)) if len(non_null) > 1 else 0.0

        columns_info.append(col_summary)

    numeric_cols = [c["name"] for c in columns_info if c["is_numeric"]]
    categorical_cols = [c["name"] for c in columns_info if not c["is_numeric"]]

    return {
        "total_rows": total_rows,
        "total_columns": total_cols,
        "numeric_column_count": len(numeric_cols),
        "categorical_column_count": len(categorical_cols),
        "columns": columns_info,
        "numeric_columns": numeric_cols,
        "categorical_columns": categorical_cols,
        "has_missing_values": any(c["missing_count"] > 0 for c in columns_info)
    }

def clean_dataset(df: pd.DataFrame, strategy: str = "drop", target_columns: list = None) -> pd.DataFrame:
    """Clean dataset missing values: strategy can be 'drop' or 'mean'."""
    df_clean = df.copy()
    cols = target_columns if target_columns else df_clean.columns

    if strategy == "drop":
        df_clean = df_clean.dropna(subset=cols)
    elif strategy == "mean":
        for col in cols:
            if pd.api.types.is_numeric_dtype(df_clean[col]):
                mean_val = df_clean[col].mean()
                df_clean[col] = df_clean[col].fillna(mean_val)
            else:
                mode_val = df_clean[col].mode()
                if not mode_val.empty:
                    df_clean[col] = df_clean[col].fillna(mode_val[0])
    return df_clean

def get_paginated_preview(df: pd.DataFrame, page: int = 1, page_size: int = 15) -> dict:
    """Return paginated slice of dataset with records as dictionaries."""
    total_records = len(df)
    total_pages = max(1, (total_records + page_size - 1) // page_size)
    page = max(1, min(page, total_pages))

    start = (page - 1) * page_size
    end = start + page_size

    slice_df = df.iloc[start:end]
    # Replace NaN with None for JSON serialization
    records = slice_df.replace({np.nan: None}).to_dict(orient="records")

    return {
        "page": page,
        "page_size": page_size,
        "total_records": total_records,
        "total_pages": total_pages,
        "data": records
    }
