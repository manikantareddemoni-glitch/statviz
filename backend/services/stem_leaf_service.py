import numpy as np
import pandas as pd
import math

def generate_stem_and_leaf(series: pd.Series, leaf_unit: float = None, split_stems: bool = False) -> dict:
    """
    Construct an elegant, detailed Stem-and-Leaf display with depth counts and interactive leaf metadata.
    Robust against arbitrary dataset sizes and wide ID numbers.
    """
    clean = series.dropna().to_numpy(dtype=float)
    n = len(clean)
    if n == 0:
        raise ValueError("No valid numeric data for stem-and-leaf display.")

    sorted_vals = np.sort(clean)
    min_val = float(sorted_vals[0])
    max_val = float(sorted_vals[-1])
    data_range = max_val - min_val

    # Auto-detect optimal leaf unit so number of stems is between 5 and 30
    if leaf_unit is None or leaf_unit <= 0:
        if data_range <= 0:
            chosen_leaf_unit = 1.0
        else:
            # We want around 10-20 stems: range / (10 * leaf_unit) ~= 15
            target_step = data_range / 15.0
            power = math.floor(math.log10(target_step)) if target_step > 0 else 0
            base_unit = 10 ** power
            
            # Normalize to 0.01, 0.1, 1, 10, 100, 1000 etc.
            if target_step / base_unit >= 5:
                chosen_leaf_unit = float(base_unit * 5)
            elif target_step / base_unit >= 2:
                chosen_leaf_unit = float(base_unit * 2)
            else:
                chosen_leaf_unit = float(base_unit)
                
            if chosen_leaf_unit <= 0:
                chosen_leaf_unit = 1.0
    else:
        chosen_leaf_unit = float(leaf_unit)

    # Safety check: if chosen leaf unit would produce > 100 stems, scale it up
    if data_range > 0 and (data_range / (10 * chosen_leaf_unit)) > 60:
        chosen_leaf_unit = float(10 ** math.floor(math.log10(data_range / 15.0)))
        if chosen_leaf_unit <= 0:
            chosen_leaf_unit = 1.0

    # Scale data by leaf unit: value = (stem * 10 + leaf) * leaf_unit
    scaled_items = []
    # If dataset has > 1000 items, take first 1000 or sample for leaf display
    display_vals = sorted_vals if n <= 500 else sorted_vals[:500]

    for idx, val in enumerate(display_vals):
        scaled_int = int(round(val / chosen_leaf_unit))
        stem = scaled_int // 10
        leaf = scaled_int % 10
        if scaled_int < 0:
            stem = - (abs(scaled_int) // 10)
            leaf = abs(scaled_int) % 10
        scaled_items.append({
            "id": f"leaf_{idx}",
            "original_value": round(float(val), 3) if not float(val).is_integer() else int(val),
            "stem": stem,
            "leaf": leaf
        })

    if not scaled_items:
        return {"rows": [], "leaf_unit": chosen_leaf_unit, "key": "N/A", "total_points": 0}

    unique_stems = sorted(list(set(item["stem"] for item in scaled_items)))
    
    # Group leaves by stem
    stem_groups = {}
    for item in scaled_items:
        s = item["stem"]
        if s not in stem_groups:
            stem_groups[s] = []
        stem_groups[s].append(item)

    # Determine stems to include (only actual stems or small intermediate gaps)
    stems_to_show = []
    if len(unique_stems) > 0:
        min_s = unique_stems[0]
        max_s = unique_stems[-1]
        if (max_s - min_s) <= 50:
            stems_to_show = list(range(min_s, max_s + 1))
        else:
            stems_to_show = unique_stems

    rows = []
    for stem in stems_to_show:
        items = stem_groups.get(stem, [])
        items_sorted = sorted(items, key=lambda x: x["leaf"])
        
        if split_stems:
            low_items = [it for it in items_sorted if it["leaf"] <= 4]
            high_items = [it for it in items_sorted if it["leaf"] >= 5]
            
            rows.append({
                "stem_label": f"{stem}*",
                "stem_value": stem,
                "split_type": "low (0-4)",
                "leaves": low_items,
                "leaf_count": len(low_items)
            })
            rows.append({
                "stem_label": f"{stem}.",
                "stem_value": stem,
                "split_type": "high (5-9)",
                "leaves": high_items,
                "leaf_count": len(high_items)
            })
        else:
            rows.append({
                "stem_label": str(stem),
                "stem_value": stem,
                "split_type": "full",
                "leaves": items_sorted,
                "leaf_count": len(items_sorted)
            })

    # Add Tukey depth / cumulative count
    total_leaves = sum(r["leaf_count"] for r in rows)
    half_count = total_leaves / 2.0
    cum_top = 0
    cum_bottom = 0

    for r in rows:
        cum_top += r["leaf_count"]
        r["cum_from_top"] = cum_top

    for r in reversed(rows):
        cum_bottom += r["leaf_count"]
        r["cum_from_bottom"] = cum_bottom

    for r in rows:
        if r["cum_from_top"] <= half_count:
            r["depth"] = str(r["cum_from_top"])
        elif r["cum_from_bottom"] <= half_count:
            r["depth"] = str(r["cum_from_bottom"])
        else:
            r["depth"] = f"({r['leaf_count']})"

    sample_item = scaled_items[len(scaled_items) // 2]
    sample_stem = sample_item["stem"]
    sample_leaf = sample_item["leaf"]
    sample_val = sample_item["original_value"]
    key_str = f"{sample_stem} | {sample_leaf} represents {sample_val}"

    # Detect if variable is an ID column or discrete code
    is_id_column = (data_range > 1000 and len(clean) > 50 and len(set(clean)) == len(clean))

    return {
        "rows": rows,
        "leaf_unit": chosen_leaf_unit,
        "key": key_str,
        "total_points": n,
        "displayed_points": len(scaled_items),
        "split_stems": split_stems,
        "min_value": round(float(min_val), 3) if not float(min_val).is_integer() else int(min_val),
        "max_value": round(float(max_val), 3) if not float(max_val).is_integer() else int(max_val),
        "is_id_column": is_id_column
    }

