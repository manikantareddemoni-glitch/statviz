import pytest
import numpy as np
import pandas as pd
from scipy import stats

from services.stats_service import calculate_descriptive_statistics, calculate_modes
from services.frequency_service import generate_frequency_distribution, calculate_sturges_bins
from services.ogive_service import generate_ogive_data
from services.stem_leaf_service import generate_stem_and_leaf
from services.chebyshev_service import calculate_chebyshev_inequality
from services.normality_service import calculate_normality_analysis
from services.skewness_service import calculate_skewness_analysis
from services.scatter_service import calculate_scatter_and_regression

def test_central_tendency_known_values():
    # Known dataset: [10, 20, 20, 30, 40, 50, 60, 70, 80] (n=9)
    # Sum = 380, Mean = 380/9 = 42.2222
    # Sorted: 10, 20, 20, 30, 40, 50, 60, 70, 80 -> Median is 5th element = 40
    # Mode = 20 (frequency = 2)
    s = pd.Series([10, 20, 20, 30, 40, 50, 60, 70, 80])
    res = calculate_descriptive_statistics(s)

    assert res["n"] == 9
    assert round(res["central_tendency"]["mean"], 2) == 42.22
    assert res["central_tendency"]["median"] == 40.0
    assert res["central_tendency"]["mode_info"]["type"] == "unimodal"
    assert res["central_tendency"]["mode_info"]["modes"] == [20.0]
    assert res["central_tendency"]["mode_info"]["frequency"] == 2

def test_multimodal_and_no_mode():
    # No mode case: all unique
    s_unique = pd.Series([1, 2, 3, 4, 5])
    res_no_mode = calculate_descriptive_statistics(s_unique)
    assert res_no_mode["central_tendency"]["mode_info"]["type"] == "no_mode"

    # Bimodal case: [10, 10, 20, 20, 30]
    s_bimodal = pd.Series([10, 10, 20, 20, 30])
    res_bimodal = calculate_descriptive_statistics(s_bimodal)
    assert res_bimodal["central_tendency"]["mode_info"]["type"] == "bimodal"
    assert set(res_bimodal["central_tendency"]["mode_info"]["modes"]) == {10.0, 20.0}

def test_dispersion_sample_vs_population():
    # Data: [2, 4, 4, 4, 5, 5, 7, 9] (n=8)
    # Mean = 40 / 8 = 5.0
    # Deviations: -3, -1, -1, -1, 0, 0, +2, +4
    # Squared deviations: 9 + 1 + 1 + 1 + 0 + 0 + 4 + 16 = 32
    # Population Variance = 32 / 8 = 4.0, Pop SD = 2.0
    # Sample Variance = 32 / 7 = 4.5714, Sample SD = sqrt(4.5714) = 2.138
    s = pd.Series([2, 4, 4, 4, 5, 5, 7, 9])
    res = calculate_descriptive_statistics(s)

    assert res["dispersion"]["population_variance"] == 4.0
    assert res["dispersion"]["population_std"] == 2.0
    assert round(res["dispersion"]["sample_variance"], 4) == 4.5714
    assert round(res["dispersion"]["sample_std"], 3) == 2.138
    assert res["dispersion"]["range"] == 7.0 # 9 - 2

def test_outlier_detection_iqr():
    # Data with deliberate outlier at 100
    s = pd.Series([10, 12, 14, 15, 16, 17, 18, 19, 20, 100])
    res = calculate_descriptive_statistics(s)

    assert 100.0 in res["boxplot"]["outliers"]
    assert res["boxplot"]["outlier_count"] >= 1

def test_frequency_distribution():
    s = pd.Series([1, 2, 2, 3, 3, 3, 4, 4, 5, 6, 7, 8, 9, 10])
    res = generate_frequency_distribution(s, num_classes=5)

    assert len(res["table"]) == 5
    assert res["totals"]["total_frequency"] == 14
    assert res["totals"]["total_percentage"] == 100.0
    assert res["table"][-1]["cumulative_frequency_less"] == 14

def test_chebyshev_inequality():
    # Generate arbitrary skewed dataset
    np.random.seed(42)
    s = pd.Series(np.random.exponential(scale=10, size=200))
    res = calculate_chebyshev_inequality(s, k=2.0)

    assert res["k"] == 2.0
    # For k=2, theoretical min is 1 - 1/4 = 75%
    assert res["theoretical_min_pct"] == 75.0
    # Actual percentage in any dataset must be >= 75%
    assert res["actual_pct"] >= 75.0
    assert res["inside_count"] + res["outside_count"] == 200

def test_normality_and_shapiro():
    # Normal distribution sample
    np.random.seed(123)
    normal_sample = pd.Series(np.random.normal(loc=50, scale=10, size=100))
    res = calculate_normality_analysis(normal_sample)

    assert "shapiro_wilk" in res
    assert res["shapiro_wilk"]["statistic"] > 0.90
    assert len(res["empirical_rule"]) == 3
    # Check 1 SD is reasonably near 68%
    assert 55.0 <= res["empirical_rule"][0]["actual_pct"] <= 85.0

def test_skewness_analysis():
    # Right-skewed sample
    np.random.seed(42)
    skewed_sample = pd.Series(np.random.exponential(scale=5, size=150) + 10)
    res = calculate_skewness_analysis(skewed_sample)

    assert res["moment_skewness"] > 0.5
    assert res["shape_type"] == "right_skewed"
    assert "Mean > Median" in res["relationship_text"]

def test_scatter_and_linear_regression():
    # Perfect linear line: y = 2x + 5
    x = pd.Series([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    y = 2 * x + 5
    res = calculate_scatter_and_regression(x, y, "X_Var", "Y_Var")

    assert round(res["pearson_r"], 4) == 1.0
    assert round(res["r_squared"], 4) == 1.0
    assert round(res["slope"], 4) == 2.0
    assert round(res["intercept"], 4) == 5.0
    assert res["strength"] == "Very Strong Positive Correlation"

def test_ogive_and_stem_leaf():
    s = pd.Series([12, 15, 18, 22, 25, 29, 31, 35, 42, 48, 55])
    ogive_res = generate_ogive_data(s, num_classes=4)
    assert len(ogive_res["less_than_points"]) > 0
    assert ogive_res["graphical_landmarks"]["median"]["x_value"] > 0

    stem_res = generate_stem_and_leaf(s, leaf_unit=1.0)
    assert stem_res["total_points"] == len(s)
    assert len(stem_res["rows"]) > 0
