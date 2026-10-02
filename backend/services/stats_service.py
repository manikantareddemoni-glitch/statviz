import numpy as np
import pandas as pd
from scipy import stats
import math

def calculate_modes(data: np.ndarray) -> dict:
    """
    Compute modes accurately.
    Returns list of mode values, their frequency, and classification:
    'no_mode', 'unimodal', 'bimodal', 'multimodal'.
    """
    if len(data) == 0:
        return {"modes": [], "frequency": 0, "type": "no_mode", "description": "No data available."}
    
    # Round data to reasonable precision for grouping floats
    rounded = np.round(data, 2)
    values, counts = np.unique(rounded, return_counts=True)
    max_count = int(np.max(counts))

    # If all values have the exact same count (and count == 1 or all identical counts across entire array),
    # then strictly no mode exists.
    if max_count == 1:
        return {
            "modes": [],
            "frequency": 1,
            "type": "no_mode",
            "description": "All values appear with equal frequency of 1 (No unique mode)."
        }
    
    if len(values) > 1 and np.all(counts == max_count):
        return {
            "modes": [],
            "frequency": max_count,
            "type": "no_mode",
            "description": f"All distinct values appear with identical frequency ({max_count}). No distinct mode."
        }

    mode_values = values[counts == max_count].tolist()
    mode_values = [round(float(v), 3) for v in mode_values]
    num_modes = len(mode_values)

    if num_modes == 1:
        mode_type = "unimodal"
        desc = f"Single distinct mode at {mode_values[0]} (frequency = {max_count})."
    elif num_modes == 2:
        mode_type = "bimodal"
        desc = f"Two modes at {mode_values[0]} and {mode_values[1]} (frequency = {max_count} each)."
    else:
        mode_type = "multimodal"
        desc = f"{num_modes} modes found: {', '.join(map(str, mode_values[:5]))} (frequency = {max_count} each)."

    return {
        "modes": mode_values,
        "frequency": max_count,
        "type": mode_type,
        "description": desc
    }

def calculate_descriptive_statistics(series: pd.Series) -> dict:
    """
    Calculate comprehensive descriptive statistics for both Central Tendency and Dispersion.
    """
    clean_series = series.dropna()
    data = clean_series.to_numpy(dtype=float)
    n = len(data)
    if n == 0:
        raise ValueError("Selected column contains no valid numeric entries.")

    sorted_data = np.sort(data)

    # 1. Central Tendency
    mean_val = float(np.mean(data))
    median_val = float(np.median(data))
    mode_info = calculate_modes(data)
    
    trimmed_5 = float(stats.trim_mean(data, 0.05)) if n >= 10 else mean_val
    trimmed_10 = float(stats.trim_mean(data, 0.10)) if n >= 10 else mean_val

    # Positive-only means
    positive_data = data[data > 0]
    geometric_mean = float(stats.gmean(positive_data)) if len(positive_data) == n else None
    harmonic_mean = float(stats.hmean(positive_data)) if len(positive_data) == n else None

    # 2. Measures of Dispersion / Variability
    min_val = float(sorted_data[0])
    max_val = float(sorted_data[-1])
    data_range = float(max_val - min_val)

    # Sample variance (ddof=1) vs Population variance (ddof=0)
    sample_var = float(np.var(data, ddof=1)) if n > 1 else 0.0
    pop_var = float(np.var(data, ddof=0))
    sample_std = float(np.std(data, ddof=1)) if n > 1 else 0.0
    pop_std = float(np.std(data, ddof=0))

    # Standard Error of the Mean
    sem = float(sample_std / math.sqrt(n)) if n > 0 else 0.0

    # Quartiles (using method='weibull' or standard linear percentiles)
    q1 = float(np.percentile(data, 25))
    q2 = median_val
    q3 = float(np.percentile(data, 75))
    iqr = float(q3 - q1)

    # Deciles & Percentiles
    p10 = float(np.percentile(data, 10))
    p90 = float(np.percentile(data, 90))

    # Outlier Detection via 1.5 * IQR Rule (Tukey's Boxplot Rule)
    lower_fence_mild = q1 - 1.5 * iqr
    upper_fence_mild = q3 + 1.5 * iqr
    lower_fence_extreme = q1 - 3.0 * iqr
    upper_fence_extreme = q3 + 3.0 * iqr

    outliers_low = data[data < lower_fence_mild].tolist()
    outliers_high = data[data > upper_fence_mild].tolist()
    all_outliers = sorted([round(float(x), 3) for x in (outliers_low + outliers_high)])
    
    extreme_outliers = sorted([round(float(x), 3) for x in data[(data < lower_fence_extreme) | (data > upper_fence_extreme)].tolist()])

    # Whisker bounds (Min and Max within inner fences for standard boxplot)
    data_within_fences = data[(data >= lower_fence_mild) & (data <= upper_fence_mild)]
    whisker_low = float(np.min(data_within_fences)) if len(data_within_fences) > 0 else min_val
    whisker_high = float(np.max(data_within_fences)) if len(data_within_fences) > 0 else max_val

    # Coefficient of Variation: CV = (s / mean) * 100%
    cv = float((sample_std / mean_val) * 100) if mean_val != 0 else 0.0

    # Mean Absolute Deviation from Mean: MAD = sum(|x - mean|) / n
    mad = float(np.mean(np.abs(data - mean_val)))

    # Sums
    sum_x = float(np.sum(data))
    sum_x_squared = float(np.sum(data ** 2))

    return {
        "n": n,
        "central_tendency": {
            "mean": round(mean_val, 4),
            "median": round(median_val, 4),
            "mode_info": mode_info,
            "primary_mode": mode_info["modes"][0] if mode_info["modes"] else None,
            "trimmed_mean_5pct": round(trimmed_5, 4),
            "trimmed_mean_10pct": round(trimmed_10, 4),
            "geometric_mean": round(geometric_mean, 4) if geometric_mean is not None else None,
            "harmonic_mean": round(harmonic_mean, 4) if harmonic_mean is not None else None,
            "sum": round(sum_x, 4),
            "sum_squared": round(sum_x_squared, 4)
        },
        "dispersion": {
            "range": round(data_range, 4),
            "min": round(min_val, 4),
            "max": round(max_val, 4),
            "sample_variance": round(sample_var, 4),
            "population_variance": round(pop_var, 4),
            "sample_std": round(sample_std, 4),
            "population_std": round(pop_std, 4),
            "standard_error": round(sem, 4),
            "q1": round(q1, 4),
            "q2_median": round(q2, 4),
            "q3": round(q3, 4),
            "iqr": round(iqr, 4),
            "p10": round(p10, 4),
            "p90": round(p90, 4),
            "coefficient_of_variation_pct": round(cv, 2),
            "mean_absolute_deviation": round(mad, 4)
        },
        "boxplot": {
            "min": round(min_val, 3),
            "whisker_low": round(whisker_low, 3),
            "q1": round(q1, 3),
            "median": round(q2, 3),
            "q3": round(q3, 3),
            "whisker_high": round(whisker_high, 3),
            "max": round(max_val, 3),
            "lower_fence_mild": round(lower_fence_mild, 3),
            "upper_fence_mild": round(upper_fence_mild, 3),
            "outliers": all_outliers,
            "extreme_outliers": extreme_outliers,
            "outlier_count": len(all_outliers)
        },
        "number_line": {
            "min": round(min_val, 2),
            "max": round(max_val, 2),
            "mean": round(mean_val, 2),
            "median": round(median_val, 2),
            "modes": mode_info["modes"],
            "q1": round(q1, 2),
            "q3": round(q3, 2),
            "sd_low": round(mean_val - sample_std, 2),
            "sd_high": round(mean_val + sample_std, 2)
        }
    }
