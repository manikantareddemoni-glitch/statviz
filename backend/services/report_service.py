import pandas as pd
import numpy as np
from .stats_service import calculate_descriptive_statistics
from .skewness_service import calculate_skewness_analysis
from .normality_service import calculate_normality_analysis
from .chebyshev_service import calculate_chebyshev_inequality
from .scatter_service import calculate_scatter_and_regression

def generate_summary_report(df: pd.DataFrame, primary_col: str, secondary_col: str = None) -> dict:
    """
    Generate an end-to-end plain-English analytical report covering all Module I statistical topics.
    """
    if primary_col not in df.columns:
        raise ValueError(f"Primary column '{primary_col}' not found in dataset.")

    series_x = df[primary_col].dropna()
    if not pd.api.types.is_numeric_dtype(series_x):
        raise ValueError(f"Primary column '{primary_col}' must be numeric.")

    stats_data = calculate_descriptive_statistics(series_x)
    skew_data = calculate_skewness_analysis(series_x)
    norm_data = calculate_normality_analysis(series_x)
    cheb_data = calculate_chebyshev_inequality(series_x, k=2.0)

    # Narrative insights synthesis
    ct = stats_data["central_tendency"]
    disp = stats_data["dispersion"]
    bp = stats_data["boxplot"]

    # 1. Central Tendency & Skewness Narrative
    mean = ct["mean"]
    median = ct["median"]
    mode_info = ct["mode_info"]
    primary_mode = ct["primary_mode"]

    if mean > median + 0.05 * disp["sample_std"]:
        ct_narrative = (
            f"'{primary_col}' is right-skewed (Mean {mean} > Median {median}). "
            f"A subset of higher scores/values pulls the arithmetic mean upward. "
            f"For skewed distributions like this, the Median ({median}) is recommended as the most robust measure of central tendency."
        )
    elif mean < median - 0.05 * disp["sample_std"]:
        ct_narrative = (
            f"'{primary_col}' is left-skewed (Mean {mean} < Median {median}). "
            f"A subset of lower values drags the arithmetic mean down. "
            f"The Median ({median}) represents the typical observation more reliably than the mean."
        )
    else:
        ct_narrative = (
            f"'{primary_col}' is virtually symmetrical (Mean {mean} ≈ Median {median}). "
            f"The arithmetic mean serves as an excellent, efficient summary of the distribution's center."
        )

    # 2. Variability & Outlier Narrative
    outlier_cnt = bp["outlier_count"]
    if outlier_cnt == 0:
        var_narrative = (
            f"Data spans a range of {disp['range']} (Min {disp['min']} to Max {disp['max']}), "
            f"with a standard deviation of {disp['sample_std']} (CV = {disp['coefficient_of_variation_pct']}%). "
            f"Applying Tukey's 1.5×IQR rule, no extreme outliers were detected."
        )
    else:
        outlier_list_str = ", ".join(map(str, bp["outliers"][:4]))
        var_narrative = (
            f"The distribution exhibits a standard deviation of {disp['sample_std']} and an IQR of {disp['iqr']}. "
            f"Tukey's 1.5×IQR rule flagged {outlier_cnt} outlier(s): [{outlier_list_str}]. "
            f"These points exceed the inner fences [{bp['lower_fence_mild']}, {bp['upper_fence_mild']}]."
        )

    # 3. Distribution & Normality Narrative
    shapiro = norm_data["shapiro_wilk"]
    if shapiro["is_normal"]:
        dist_narrative = (
            f"Shapiro-Wilk normality test fails to reject normality (W = {shapiro['statistic']}, p = {shapiro['p_value_formatted']}). "
            f"The Empirical Rule applies well: {norm_data['empirical_rule'][0]['actual_pct']}% of points lie within 1 SD (target 68.3%), "
            f"and {norm_data['empirical_rule'][1]['actual_pct']}% lie within 2 SD (target 95.5%)."
        )
    else:
        dist_narrative = (
            f"Shapiro-Wilk test indicates non-normality (W = {shapiro['statistic']}, p = {shapiro['p_value_formatted']} < 0.05). "
            f"However, Chebyshev's Theorem reliably bounds the data: {cheb_data['actual_pct']}% of points lie within 2 SDs "
            f"(strictly above the theoretical floor of {cheb_data['theoretical_min_pct']}%)."
        )

    # 4. Bivariate narrative if secondary column provided
    bivariate_summary = None
    if secondary_col and secondary_col in df.columns and pd.api.types.is_numeric_dtype(df[secondary_col]):
        try:
            scatter_res = calculate_scatter_and_regression(series_x, df[secondary_col], x_name=primary_col, y_name=secondary_col)
            bivariate_summary = {
                "secondary_column": secondary_col,
                "pearson_r": scatter_res["pearson_r"],
                "r_squared_pct": scatter_res["r_squared_pct"],
                "equation": scatter_res["equation"],
                "strength": scatter_res["strength"],
                "narrative": scatter_res["explanation"]
            }
        except Exception:
            pass

    # Full Combined Metrics Table
    metrics_table = [
        {"category": "Sample Info", "metric": "Sample Size (n)", "value": stats_data["n"], "symbol": "n"},
        {"category": "Central Tendency", "metric": "Arithmetic Mean", "value": ct["mean"], "symbol": "x̄"},
        {"category": "Central Tendency", "metric": "Median (50th Percentile)", "value": ct["median"], "symbol": "Q₂ / M"},
        {"category": "Central Tendency", "metric": "Mode", "value": primary_mode if primary_mode is not None else "No unique mode", "symbol": "Mo"},
        {"category": "Central Tendency", "metric": "Trimmed Mean (5%)", "value": ct["trimmed_mean_5pct"], "symbol": "x̄₀.₀₅"},
        {"category": "Dispersion", "metric": "Minimum", "value": disp["min"], "symbol": "Min"},
        {"category": "Dispersion", "metric": "Maximum", "value": disp["max"], "symbol": "Max"},
        {"category": "Dispersion", "metric": "Range", "value": disp["range"], "symbol": "R"},
        {"category": "Dispersion", "metric": "Sample Variance", "value": disp["sample_variance"], "symbol": "s²"},
        {"category": "Dispersion", "metric": "Population Variance", "value": disp["population_variance"], "symbol": "σ²"},
        {"category": "Dispersion", "metric": "Sample Standard Deviation", "value": disp["sample_std"], "symbol": "s"},
        {"category": "Dispersion", "metric": "Standard Error of Mean", "value": disp["standard_error"], "symbol": "SE"},
        {"category": "Dispersion", "metric": "First Quartile (25th %)", "value": disp["q1"], "symbol": "Q₁"},
        {"category": "Dispersion", "metric": "Third Quartile (75th %)", "value": disp["q3"], "symbol": "Q₃"},
        {"category": "Dispersion", "metric": "Interquartile Range", "value": disp["iqr"], "symbol": "IQR"},
        {"category": "Dispersion", "metric": "Coefficient of Variation", "value": f"{disp['coefficient_of_variation_pct']}%", "symbol": "CV"},
        {"category": "Shape & Skewness", "metric": "Fisher-Pearson Moment Skewness", "value": skew_data["moment_skewness"], "symbol": "g₁"},
        {"category": "Shape & Skewness", "metric": "Pearson Median Skewness", "value": skew_data["pearson_median_skewness"], "symbol": "Sk₂"},
        {"category": "Shape & Skewness", "metric": "Excess Kurtosis", "value": skew_data["excess_kurtosis"], "symbol": "g₂"},
        {"category": "Shape & Skewness", "metric": "Distribution Classification", "value": skew_data["category"], "symbol": "Class"},
        {"category": "Normality", "metric": "Shapiro-Wilk W Statistic", "value": shapiro["statistic"], "symbol": "W"},
        {"category": "Normality", "metric": "Shapiro-Wilk p-value", "value": shapiro["p_value_formatted"], "symbol": "p"},
        {"category": "Normality", "metric": "Normality Assessment", "value": shapiro["badge_status"], "symbol": "Verdict"},
        {"category": "Chebyshev (k=2)", "metric": "Guaranteed Min % (1 - 1/k²)", "value": f"{cheb_data['theoretical_min_pct']}%", "symbol": "Bound"},
        {"category": "Chebyshev (k=2)", "metric": "Actual Dataset % within 2 SD", "value": f"{cheb_data['actual_pct']}%", "symbol": "Actual"}
    ]

    return {
        "primary_column": primary_col,
        "sample_size": stats_data["n"],
        "narratives": {
            "central_tendency": ct_narrative,
            "variability_and_outliers": var_narrative,
            "normality_and_distribution": dist_narrative
        },
        "metrics_table": metrics_table,
        "descriptive_stats": stats_data,
        "skewness": skew_data,
        "normality": norm_data,
        "chebyshev": cheb_data,
        "bivariate": bivariate_summary
    }
