import numpy as np
import pandas as pd
import math

def calculate_sturges_bins(n: int) -> int:
    """Calculate recommended number of bins using Sturges' formula: k = 1 + 3.322 * log10(n)."""
    if n <= 1:
        return 1
    return max(3, min(50, int(math.ceil(1 + 3.322 * math.log10(n)))))

def calculate_freedman_diaconis_bins(data: np.ndarray) -> int:
    """Calculate recommended bins using Freedman-Diaconis rule based on IQR."""
    n = len(data)
    if n <= 2:
        return 5
    q75, q25 = np.percentile(data, [75, 25])
    iqr = q75 - q25
    if iqr == 0:
        return calculate_sturges_bins(n)
    h = 2 * iqr * (n ** (-1/3))
    if h == 0:
        return calculate_sturges_bins(n)
    data_range = data.max() - data.min()
    bins = int(math.ceil(data_range / h))
    return max(3, min(50, bins))

def generate_frequency_distribution(series: pd.Series, num_classes: int = None, class_width: float = None) -> dict:
    """
    Generate comprehensive frequency distribution table and chart points.
    Supports fixed number of classes or custom class width.
    """
    clean_data = series.dropna().to_numpy(dtype=float)
    n = len(clean_data)
    if n == 0:
        raise ValueError("Selected column has no valid numeric data.")

    min_val = float(np.min(clean_data))
    max_val = float(np.max(clean_data))
    data_range = max_val - min_val

    # Edge case: all identical values
    if data_range == 0:
        data_range = 1.0
        min_val -= 0.5
        max_val += 0.5

    # Determine number of classes / class width
    sturges_k = calculate_sturges_bins(n)
    fd_k = calculate_freedman_diaconis_bins(clean_data)

    if class_width is not None and class_width > 0:
        k = max(2, min(60, int(math.ceil(data_range / class_width))))
        w = float(class_width)
        bin_edges = [min_val + i * w for i in range(k + 1)]
        if bin_edges[-1] < max_val:
            bin_edges.append(bin_edges[-1] + w)
            k += 1
    else:
        k = int(num_classes) if num_classes and num_classes >= 2 else sturges_k
        k = max(2, min(50, k))
        w = data_range / k
        bin_edges = np.linspace(min_val, max_val, k + 1).tolist()

    # Bin the data
    # Include right edge in last bin
    counts, edges = np.histogram(clean_data, bins=bin_edges)

    table_rows = []
    cum_freq_less = 0
    total_count = int(n)

    # Compute less-than and more-than cumulative frequencies
    # For more-than, we sum from the current bin to the end
    more_than_cum = total_count

    for i in range(len(counts)):
        freq = int(counts[i])
        lower_limit = round(edges[i], 3)
        upper_limit = round(edges[i + 1], 3)
        class_mark = round((lower_limit + upper_limit) / 2.0, 3)
        
        rel_freq = round(freq / total_count, 4)
        percentage = round(rel_freq * 100, 2)
        
        cum_freq_less += freq
        cum_pct_less = round((cum_freq_less / total_count) * 100, 2)
        
        more_than_freq = more_than_cum
        more_than_pct = round((more_than_freq / total_count) * 100, 2)
        more_than_cum -= freq

        interval_label = f"[{lower_limit} - {upper_limit}{']' if i == len(counts)-1 else ')'}"

        table_rows.append({
            "class_index": i + 1,
            "interval_label": interval_label,
            "lower_bound": lower_limit,
            "upper_bound": upper_limit,
            "class_mark": class_mark,
            "frequency": freq,
            "relative_frequency": rel_freq,
            "percentage": percentage,
            "cumulative_frequency_less": cum_freq_less,
            "cumulative_percentage_less": cum_pct_less,
            "cumulative_frequency_more": more_than_freq,
            "cumulative_percentage_more": more_than_pct
        })

    # Summary row
    totals = {
        "total_frequency": total_count,
        "total_relative_frequency": 1.0,
        "total_percentage": 100.0,
        "num_classes": len(table_rows),
        "class_width": round(edges[1] - edges[0], 3),
        "data_min": round(min_val, 3),
        "data_max": round(max_val, 3),
        "data_range": round(data_range, 3),
        "sturges_recommended_bins": sturges_k,
        "fd_recommended_bins": fd_k
    }

    return {
        "table": table_rows,
        "totals": totals,
        "bin_edges": [round(e, 3) for e in edges]
    }
