import numpy as np
import pandas as pd
from scipy import stats
import math

def calculate_normality_analysis(series: pd.Series, num_bins: int = 15) -> dict:
    """
    Perform complete normality assessment:
    1. Fitted Normal Distribution Curve points.
    2. Empirical Rule (68-95-99.7) validation.
    3. Quantile-Quantile (Q-Q) Plot coordinates with reference line.
    4. Shapiro-Wilk & D'Agostino-Pearson statistical hypothesis tests.
    """
    clean = series.dropna().to_numpy(dtype=float)
    n = len(clean)
    if n < 3:
        raise ValueError("At least 3 valid observations are required for normality testing.")

    mean_val = float(np.mean(clean))
    std_val = float(np.std(clean, ddof=1)) if n > 1 else 1.0
    if std_val == 0:
        std_val = 1e-6

    # 1. Empirical Rule (68 - 95 - 99.7)
    empirical_intervals = []
    for k, theo_pct, label in [
        (1, 68.27, "Within 1 SD (μ ± 1σ)"),
        (2, 95.45, "Within 2 SD (μ ± 2σ)"),
        (3, 99.73, "Within 3 SD (μ ± 3σ)")
    ]:
        low = mean_val - k * std_val
        high = mean_val + k * std_val
        cnt = int(np.sum((clean >= low) & (clean <= high)))
        act_pct = round((cnt / n) * 100.0, 2)
        diff = round(act_pct - theo_pct, 2)
        empirical_intervals.append({
            "k": k,
            "label": label,
            "lower_bound": round(low, 2),
            "upper_bound": round(high, 2),
            "theoretical_pct": theo_pct,
            "actual_pct": act_pct,
            "count": cnt,
            "difference_pct": diff
        })

    # 2. Shapiro-Wilk Normality Test
    # SciPy shapiro requires sample size between 3 and 5000
    sub_sample = clean if n <= 5000 else np.random.choice(clean, 5000, replace=False)
    shapiro_stat, shapiro_p = stats.shapiro(sub_sample)
    
    alpha = 0.05
    is_normal_shapiro = bool(shapiro_p >= alpha)

    if is_normal_shapiro:
        verdict = f"Data appears to follow an approximately Normal Distribution (Fail to reject H₀: W = {round(shapiro_stat, 4)}, p = {round(shapiro_p, 4)} ≥ 0.05)."
        badge_status = "Normal"
        badge_color = "emerald"
    else:
        verdict = f"Data significantly deviates from a Normal Distribution (Reject H₀ at α = 0.05: W = {round(shapiro_stat, 4)}, p = {shapiro_p:.4e} < 0.05)."
        badge_status = "Non-Normal"
        badge_color = "amber"

    # 3. Q-Q Plot Coordinates
    # Theoretical normal quantiles using Blom's ranking method: (i - 3/8) / (n + 1/4)
    sorted_data = np.sort(clean)
    ranks = np.arange(1, n + 1)
    probabilities = (ranks - 0.375) / (n + 0.25)
    theoretical_quantiles = stats.norm.ppf(probabilities)

    qq_points = []
    # If sample size is very large, sample 200 points for smooth charting
    step = max(1, n // 200)
    for i in range(0, n, step):
        t_q = float(theoretical_quantiles[i])
        s_q = float(sorted_data[i])
        # Expected theoretical point on line: mean + t_q * std
        line_val = float(mean_val + t_q * std_val)
        qq_points.append({
            "theoretical_quantile": round(t_q, 3),
            "sample_quantile": round(s_q, 3),
            "reference_line": round(line_val, 3)
        })

    # 4. Histogram and Fitted Normal PDF Curve Points
    min_x = mean_val - 3.5 * std_val
    max_x = mean_val + 3.5 * std_val
    counts, bin_edges = np.histogram(clean, bins=num_bins, range=(min(np.min(clean), min_x), max(np.max(clean), max_x)))
    bin_width = float(bin_edges[1] - bin_edges[0])

    # Fitted continuous curve
    x_curve = np.linspace(bin_edges[0], bin_edges[-1], 60)
    # Scaled to frequency: f(x) = norm.pdf(x, mean, std) * n * bin_width
    pdf_values = stats.norm.pdf(x_curve, mean_val, std_val) * n * bin_width

    fitted_curve = []
    for x, y in zip(x_curve, pdf_values):
        fitted_curve.append({
            "x": round(float(x), 2),
            "normal_fitted_freq": round(float(y), 2),
            "normal_density": round(float(stats.norm.pdf(x, mean_val, std_val)), 5)
        })

    # Formatted histogram bars
    hist_bars = []
    for i in range(len(counts)):
        mid = (bin_edges[i] + bin_edges[i+1]) / 2.0
        hist_bars.append({
            "bin_lower": round(float(bin_edges[i]), 2),
            "bin_upper": round(float(bin_edges[i+1]), 2),
            "bin_mid": round(float(mid), 2),
            "count": int(counts[i]),
            "expected_normal_count": round(float(stats.norm.pdf(mid, mean_val, std_val) * n * bin_width), 2)
        })

    return {
        "mean": round(mean_val, 3),
        "std": round(std_val, 3),
        "sample_size": n,
        "shapiro_wilk": {
            "statistic": round(float(shapiro_stat), 4),
            "p_value": float(shapiro_p),
            "p_value_formatted": f"{shapiro_p:.4f}" if shapiro_p >= 0.0001 else f"{shapiro_p:.2e}",
            "is_normal": is_normal_shapiro,
            "verdict": verdict,
            "badge_status": badge_status,
            "badge_color": badge_color
        },
        "empirical_rule": empirical_intervals,
        "qq_plot": {
            "points": qq_points,
            "slope": round(std_val, 3),
            "intercept": round(mean_val, 3)
        },
        "fitted_normal_curve": fitted_curve,
        "histogram_bars": hist_bars
    }
