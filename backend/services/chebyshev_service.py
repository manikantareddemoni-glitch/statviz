import numpy as np
import pandas as pd

def calculate_chebyshev_inequality(series: pd.Series, k: float = 2.0, num_bins: int = 15) -> dict:
    """
    Evaluate Chebyshev's Inequality for parameter k > 1.
    Compares the theoretical minimum bound with the empirical percentage in the dataset.
    """
    clean = series.dropna().to_numpy(dtype=float)
    n = len(clean)
    if n == 0:
        raise ValueError("Cannot calculate Chebyshev's inequality on empty data.")

    mean_val = float(np.mean(clean))
    std_val = float(np.std(clean, ddof=1)) if n > 1 else 0.0

    if std_val == 0:
        std_val = 1e-6

    k = max(1.01, float(k))

    # Theoretical Guaranteed Lower Bound: 1 - 1/k^2
    theoretical_min_proportion = 1.0 - (1.0 / (k ** 2))
    theoretical_min_pct = round(theoretical_min_proportion * 100.0, 2)

    # Interval bounds: [mean - k*s, mean + k*s]
    lower_bound = mean_val - k * std_val
    upper_bound = mean_val + k * std_val

    # Empirical count and percentage
    inside_mask = (clean >= lower_bound) & (clean <= upper_bound)
    inside_count = int(np.sum(inside_mask))
    actual_pct = round((inside_count / n) * 100.0, 2)

    outside_count = n - inside_count
    outside_pct = round(100.0 - actual_pct, 2)

    # Histogram binning with inside/outside tag for visualization
    min_x = min(float(np.min(clean)), lower_bound - 0.2 * std_val)
    max_x = max(float(np.max(clean)), upper_bound + 0.2 * std_val)

    counts, bin_edges = np.histogram(clean, bins=num_bins, range=(min_x, max_x))
    
    histogram_data = []
    for i in range(len(counts)):
        b_low = float(bin_edges[i])
        b_high = float(bin_edges[i + 1])
        b_mid = (b_low + b_high) / 2.0
        
        # Determine status: inside interval if mid-point is within bounds
        is_inside = (b_mid >= lower_bound) and (b_mid <= upper_bound)

        histogram_data.append({
            "bin_index": i + 1,
            "bin_lower": round(b_low, 2),
            "bin_upper": round(b_high, 2),
            "bin_mid": round(b_mid, 2),
            "count": int(counts[i]),
            "percentage": round((counts[i] / n) * 100, 2),
            "is_within_chebyshev": is_inside
        })

    # Benchmark comparison table for standard k values
    benchmarks = []
    for test_k in [1.25, 1.5, 2.0, 2.5, 3.0, 4.0]:
        t_bound = round((1.0 - (1.0 / (test_k ** 2))) * 100.0, 2)
        lb = mean_val - test_k * std_val
        ub = mean_val + test_k * std_val
        act_cnt = int(np.sum((clean >= lb) & (clean <= ub)))
        act_p = round((act_cnt / n) * 100.0, 2)
        benchmarks.append({
            "k": test_k,
            "formula": f"1 - 1/{test_k}^2",
            "guaranteed_min_pct": t_bound,
            "actual_pct": act_p,
            "lower_bound": round(lb, 2),
            "upper_bound": round(ub, 2),
            "is_valid": act_p >= t_bound
        })

    explanation = (
        f"Chebyshev's Theorem guarantees that AT LEAST {theoretical_min_pct}% of the data points must lie "
        f"within {k} standard deviations of the mean ({round(lower_bound, 2)} to {round(upper_bound, 2)}), "
        f"regardless of the shape of the probability distribution. In this dataset, exactly {actual_pct}% "
        f"({inside_count} out of {n} observations) fall within this interval, which strictly satisfies the theorem."
    )

    return {
        "k": round(k, 2),
        "mean": round(mean_val, 3),
        "std": round(std_val, 3),
        "lower_bound": round(lower_bound, 3),
        "upper_bound": round(upper_bound, 3),
        "theoretical_min_pct": theoretical_min_pct,
        "actual_pct": actual_pct,
        "inside_count": inside_count,
        "outside_count": outside_count,
        "total_count": n,
        "histogram_data": histogram_data,
        "benchmarks": benchmarks,
        "explanation": explanation
    }
