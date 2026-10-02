import numpy as np
import pandas as pd
from scipy import stats
import math

def calculate_scatter_and_regression(series_x: pd.Series, series_y: pd.Series, x_name: str = "X", y_name: str = "Y") -> dict:
    """
    Compute bivariate correlation, covariance, simple linear regression, and point scatter data.
    """
    # Align and drop missing in either column
    combined = pd.DataFrame({"x": series_x, "y": series_y}).dropna()
    n = len(combined)
    if n < 3:
        raise ValueError("At least 3 complete (X, Y) pairs are required for correlation analysis.")

    x = combined["x"].to_numpy(dtype=float)
    y = combined["y"].to_numpy(dtype=float)

    mean_x = float(np.mean(x))
    mean_y = float(np.mean(y))
    std_x = float(np.std(x, ddof=1)) if n > 1 else 1.0
    std_y = float(np.std(y, ddof=1)) if n > 1 else 1.0

    if std_x == 0 or std_y == 0:
        raise ValueError("One of the selected variables has zero variance (constant values).")

    # Pearson r and p-value
    r_val, p_val = stats.pearsonr(x, y)
    r_val = float(r_val)
    p_val = float(p_val)
    r_squared = float(r_val ** 2)

    # Sample Covariance
    cov_xy = float(np.cov(x, y)[0, 1])

    # Linear Regression via SciPy linregress
    reg = stats.linregress(x, y)
    slope = float(reg.slope)
    intercept = float(reg.intercept)
    std_err = float(reg.stderr) if reg.stderr is not None else 0.0

    # Equation formatting: y = mx + c
    sign = "+" if intercept >= 0 else "-"
    equation = f"{y_name} = {round(slope, 3)} × {x_name} {sign} {round(abs(intercept), 3)}"

    # Correlation Strength Classification
    abs_r = abs(r_val)
    direction = "Positive" if r_val > 0 else "Negative"

    if abs_r >= 0.85:
        strength = f"Very Strong {direction} Correlation"
        strength_badge = "emerald"
    elif abs_r >= 0.65:
        strength = f"Strong {direction} Correlation"
        strength_badge = "teal"
    elif abs_r >= 0.40:
        strength = f"Moderate {direction} Correlation"
        strength_badge = "blue"
    elif abs_r >= 0.20:
        strength = f"Weak {direction} Correlation"
        strength_badge = "amber"
    else:
        strength = "Very Weak / Negligible Correlation"
        strength_badge = "slate"

    explanation = (
        f"A Pearson correlation coefficient of r = {round(r_val, 4)} (r² = {round(r_squared * 100, 1)}%) "
        f"indicates a {strength.lower()}. "
        f"Approximately {round(r_squared * 100, 1)}% of the total variation in '{y_name}' "
        f"can be statistically explained by its linear relationship with '{x_name}'."
    )

    # Prepare point data with predicted values and residuals
    min_x = float(np.min(x))
    max_x = float(np.max(x))
    
    points = []
    for i in range(n):
        pred_y = float(slope * x[i] + intercept)
        res = float(y[i] - pred_y)
        points.append({
            "id": i + 1,
            "x": round(float(x[i]), 3),
            "y": round(float(y[i]), 3),
            "y_pred": round(pred_y, 3),
            "residual": round(res, 3)
        })

    # Line boundary coordinates for plotting smooth line
    line_start = {"x": round(min_x, 3), "y": round(slope * min_x + intercept, 3)}
    line_end = {"x": round(max_x, 3), "y": round(slope * max_x + intercept, 3)}

    return {
        "n": n,
        "x_name": x_name,
        "y_name": y_name,
        "mean_x": round(mean_x, 3),
        "mean_y": round(mean_y, 3),
        "std_x": round(std_x, 3),
        "std_y": round(std_y, 3),
        "covariance": round(cov_xy, 4),
        "pearson_r": round(r_val, 4),
        "r_squared": round(r_squared, 4),
        "r_squared_pct": round(r_squared * 100, 2),
        "p_value": float(p_val),
        "p_value_formatted": f"{p_val:.4f}" if p_val >= 0.0001 else f"{p_val:.2e}",
        "slope": round(slope, 4),
        "intercept": round(intercept, 4),
        "std_err": round(std_err, 4),
        "equation": equation,
        "strength": strength,
        "strength_badge": strength_badge,
        "explanation": explanation,
        "points": points,
        "regression_line": [line_start, line_end]
    }
