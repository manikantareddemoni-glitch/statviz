import numpy as np
import pandas as pd
from scipy import stats
from .stats_service import calculate_modes

def calculate_skewness_analysis(series: pd.Series) -> dict:
    """
    Perform deep skewness and distribution shape analysis:
    - Fisher-Pearson moment skewness
    - Pearson's 1st (mode) and 2nd (median) skewness coefficients
    - Kurtosis (peakedness & tail weight)
    - Animated needle gauge metrics
    - Mean-Median-Mode alignment comparison
    """
    clean = series.dropna().to_numpy(dtype=float)
    n = len(clean)
    if n < 3:
        raise ValueError("At least 3 observations are required for skewness calculation.")

    mean_val = float(np.mean(clean))
    median_val = float(np.median(clean))
    std_val = float(np.std(clean, ddof=1)) if n > 1 else 1.0
    if std_val == 0:
        std_val = 1e-6

    mode_info = calculate_modes(clean)
    primary_mode = mode_info["modes"][0] if mode_info["modes"] else median_val

    # 1. Moment Skewness (Sample unbiased)
    moment_skewness = float(stats.skew(clean, bias=False)) if n >= 3 else 0.0
    
    # 2. Kurtosis (Fisher excess kurtosis where normal = 0)
    excess_kurtosis = float(stats.kurtosis(clean, bias=False)) if n >= 4 else 0.0

    # 3. Pearson's Coefficients
    pearson_mode_skew = float((mean_val - primary_mode) / std_val) if mode_info["modes"] else None
    pearson_median_skew = float(3.0 * (mean_val - median_val) / std_val)

    # 4. Classification & Interpretation
    if moment_skewness > 1.0:
        skew_category = "Highly Right-Skewed (Positive Skew)"
        shape_type = "right_skewed"
        relationship_text = "Mean > Median > Mode"
        explanation = (
            f"The distribution has a pronounced long tail extending to the right. "
            f"A cluster of high extreme values pulls the Mean ({round(mean_val, 2)}) "
            f"above the Median ({round(median_val, 2)}). The Median is the preferred measure of central tendency here."
        )
        accent_color = "#f59e0b" # amber
    elif moment_skewness > 0.5:
        skew_category = "Moderately Right-Skewed (Positive Skew)"
        shape_type = "right_skewed"
        relationship_text = "Mean > Median"
        explanation = (
            f"The data is moderately skewed to the right with a mild upper tail. "
            f"The Mean ({round(mean_val, 2)}) exceeds the Median ({round(median_val, 2)})."
        )
        accent_color = "#eab308" # yellow
    elif moment_skewness < -1.0:
        skew_category = "Highly Left-Skewed (Negative Skew)"
        shape_type = "left_skewed"
        relationship_text = "Mean < Median < Mode"
        explanation = (
            f"The distribution has a pronounced long tail extending to the left. "
            f"Low extreme values pull the Mean ({round(mean_val, 2)}) "
            f"below the Median ({round(median_val, 2)}). The Median is the more representative center."
        )
        accent_color = "#ec4899" # pink
    elif moment_skewness < -0.5:
        skew_category = "Moderately Left-Skewed (Negative Skew)"
        shape_type = "left_skewed"
        relationship_text = "Mean < Median"
        explanation = (
            f"The data is moderately skewed to the left with a mild lower tail. "
            f"The Mean ({round(mean_val, 2)}) is slightly lower than the Median ({round(median_val, 2)})."
        )
        accent_color = "#8b5cf6" # purple
    else:
        skew_category = "Approximately Symmetric (Normal Shape)"
        shape_type = "symmetric"
        relationship_text = "Mean ≈ Median ≈ Mode"
        explanation = (
            f"The distribution is balanced and symmetrical. "
            f"The Mean ({round(mean_val, 2)}) and Median ({round(median_val, 2)}) are very close to each other. "
            f"The Mean is an excellent, efficient summary measure."
        )
        accent_color = "#10b981" # emerald

    # 5. Kurtosis classification
    if excess_kurtosis > 1.0:
        kurtosis_type = "Leptokurtic (Heavy-tailed / Sharp Peak)"
    elif excess_kurtosis < -1.0:
        kurtosis_type = "Platykurtic (Light-tailed / Flat Peak)"
    else:
        kurtosis_type = "Mesokurtic (Normal-like Kurtosis)"

    # 6. Gauge meter needle angle (-90 deg to +90 deg, mapped from skewness -2.5 to +2.5)
    clipped_skew = max(-2.5, min(2.5, moment_skewness))
    gauge_angle = round((clipped_skew / 2.5) * 90, 1) # -90 to +90

    # 7. Mean-Median-Mode relative position on a 0-100 normalized baseline
    min_x = float(np.min(clean))
    max_x = float(np.max(clean))
    span = max_x - min_x if max_x > min_x else 1.0

    def to_percent(val):
        return round(((val - min_x) / span) * 100, 1)

    alignment = {
        "mean_pct": to_percent(mean_val),
        "median_pct": to_percent(median_val),
        "mode_pct": to_percent(primary_mode) if mode_info["modes"] else None,
        "mean_val": round(mean_val, 2),
        "median_val": round(median_val, 2),
        "mode_val": round(primary_mode, 2) if mode_info["modes"] else "N/A"
    }

    return {
        "moment_skewness": round(moment_skewness, 4),
        "excess_kurtosis": round(excess_kurtosis, 4),
        "pearson_mode_skewness": round(pearson_mode_skew, 4) if pearson_mode_skew is not None else None,
        "pearson_median_skewness": round(pearson_median_skew, 4),
        "category": skew_category,
        "shape_type": shape_type,
        "relationship_text": relationship_text,
        "kurtosis_type": kurtosis_type,
        "explanation": explanation,
        "accent_color": accent_color,
        "gauge_angle": gauge_angle,
        "alignment": alignment
    }
