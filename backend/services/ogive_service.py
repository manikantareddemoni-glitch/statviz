import numpy as np
import pandas as pd
from .frequency_service import generate_frequency_distribution

def generate_ogive_data(series: pd.Series, num_classes: int = None) -> dict:
    """
    Generate Less-Than and More-Than Ogive coordinates and quartile intersection points.
    """
    freq_data = generate_frequency_distribution(series, num_classes=num_classes)
    table = freq_data["table"]
    n = freq_data["totals"]["total_frequency"]

    if len(table) == 0 or n == 0:
        raise ValueError("Cannot construct ogives from empty dataset.")

    # 1. Less-Than Ogive:
    # Begins at (first_lower_boundary, 0)
    # Then each point is (upper_bound, cumulative_freq)
    first_lower = table[0]["lower_bound"]
    
    less_than_points = [{
        "x": first_lower,
        "boundary_type": "lower_limit_0",
        "cumulative_frequency": 0,
        "cumulative_percentage": 0.0,
        "label": f"Base ({first_lower}, 0)"
    }]

    for row in table:
        less_than_points.append({
            "x": row["upper_bound"],
            "boundary_type": "upper_bound",
            "cumulative_frequency": row["cumulative_frequency_less"],
            "cumulative_percentage": row["cumulative_percentage_less"],
            "label": f"Upper Limit {row['upper_bound']}: {row['cumulative_frequency_less']} ({row['cumulative_percentage_less']}%)"
        })

    # 2. More-Than Ogive:
    # Starts at (first_lower, total_frequency)
    # Each point is (lower_bound, more_than_cumulative_freq)
    # Ends at (last_upper, 0)
    more_than_points = []
    for row in table:
        more_than_points.append({
            "x": row["lower_bound"],
            "boundary_type": "lower_bound",
            "cumulative_frequency": row["cumulative_frequency_more"],
            "cumulative_percentage": row["cumulative_percentage_more"],
            "label": f"Lower Limit {row['lower_bound']}: {row['cumulative_frequency_more']} ({row['cumulative_percentage_more']}%)"
        })
    
    last_upper = table[-1]["upper_bound"]
    more_than_points.append({
        "x": last_upper,
        "boundary_type": "upper_limit_final",
        "cumulative_frequency": 0,
        "cumulative_percentage": 0.0,
        "label": f"End ({last_upper}, 0)"
    })

    # 3. Merged / Unified Points for chart plotting
    # Align by X
    all_x = sorted(list(set([p["x"] for p in less_than_points] + [p["x"] for p in more_than_points])))
    
    # Linear interpolation helper for less-than ogive
    lt_x = [p["x"] for p in less_than_points]
    lt_y_freq = [p["cumulative_frequency"] for p in less_than_points]
    lt_y_pct = [p["cumulative_percentage"] for p in less_than_points]

    mt_x = [p["x"] for p in more_than_points]
    mt_y_freq = [p["cumulative_frequency"] for p in more_than_points]
    mt_y_pct = [p["cumulative_percentage"] for p in more_than_points]

    combined_series = []
    for x in all_x:
        # Interpolate less than
        y_lt_f = float(np.interp(x, lt_x, lt_y_freq))
        y_lt_p = float(np.interp(x, lt_x, lt_y_pct))
        
        # Interpolate more than (reverse x orientation handled by np.interp on sorted arrays)
        y_mt_f = float(np.interp(x, mt_x, mt_y_freq))
        y_mt_p = float(np.interp(x, mt_x, mt_y_pct))

        combined_series.append({
            "x": round(x, 2),
            "less_than_frequency": round(y_lt_f, 2),
            "less_than_percentage": round(y_lt_p, 2),
            "more_than_frequency": round(y_mt_f, 2),
            "more_than_percentage": round(y_mt_p, 2)
        })

    # Graphical Quartiles & Median derived from Less-Than Ogive
    # Exact inverse interpolation: finding X given Y (cumulative frequency)
    # Note lt_y_freq is strictly monotonic increasing
    def get_x_for_freq(target_f):
        return float(np.interp(target_f, lt_y_freq, lt_x))

    q1_freq = n * 0.25
    median_freq = n * 0.50
    q3_freq = n * 0.75

    graphical_q1 = round(get_x_for_freq(q1_freq), 3)
    graphical_median = round(get_x_for_freq(median_freq), 3)
    graphical_q3 = round(get_x_for_freq(q3_freq), 3)

    return {
        "n": n,
        "less_than_points": less_than_points,
        "more_than_points": more_than_points,
        "combined_chart_data": combined_series,
        "graphical_landmarks": {
            "q1": {"frequency": round(q1_freq, 1), "percentage": 25.0, "x_value": graphical_q1},
            "median": {"frequency": round(median_freq, 1), "percentage": 50.0, "x_value": graphical_median},
            "q3": {"frequency": round(q3_freq, 1), "percentage": 75.0, "x_value": graphical_q3}
        }
    }
