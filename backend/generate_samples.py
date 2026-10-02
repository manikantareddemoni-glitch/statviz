import numpy as np
import pandas as pd
import os

np.random.seed(42)

# 1. Student Marks Dataset (100 students)
n_students = 100
student_ids = [f"STU{1000 + i}" for i in range(1, n_students + 1)]
study_hours = np.round(np.random.gamma(shape=3.5, scale=2.5, size=n_students) + 2, 1)
# Math score correlates with study hours, right-skewed/gamma tendency with some spread
math_raw = 35 + 3.8 * study_hours + np.random.normal(0, 7.5, n_students)
math_scores = np.clip(np.round(math_raw, 1), 25, 99)
# Science score correlates moderately with math and study hours
science_scores = np.clip(np.round(30 + 0.5 * math_scores + 2.0 * study_hours + np.random.normal(0, 6.0, n_students), 1), 28, 98)
# English score with different distribution (slightly left-skewed with high median)
english_scores = np.clip(np.round(100 - np.random.exponential(scale=18, size=n_students), 1), 30, 100)
attendance = np.clip(np.round(np.random.beta(a=8, b=2, size=n_students) * 100, 1), 55, 100)
extracurricular = np.round(np.random.uniform(0.5, 15.0, size=n_students), 1)

df_students = pd.DataFrame({
    "Student_ID": student_ids,
    "Math_Score": math_scores,
    "Science_Score": science_scores,
    "English_Score": english_scores,
    "Study_Hours": study_hours,
    "Attendance_Rate": attendance,
    "Extracurricular_Hours": extracurricular
})

# Add a few realistic missing values to test missing-value handling
df_students.loc[12, "Math_Score"] = np.nan
df_students.loc[34, "Study_Hours"] = np.nan
df_students.loc[67, "English_Score"] = np.nan

df_students.to_csv("backend/data/student_marks.csv", index=False)

# 2. Heights & Weights Dataset (120 adults)
n_people = 120
person_ids = [f"P{2000 + i}" for i in range(1, n_people + 1)]
genders = np.random.choice(["Female", "Male"], size=n_people, p=[0.52, 0.48])

heights = []
weights = []
for g in genders:
    if g == "Female":
        h = np.random.normal(163.5, 6.8)
        # Weight roughly correlates with height
        w = (h - 100) * 0.9 + np.random.normal(0, 7.2)
    else:
        h = np.random.normal(176.2, 7.4)
        w = (h - 100) * 1.05 + np.random.normal(0, 8.5)
    heights.append(round(h, 1))
    weights.append(round(max(42.0, w), 1))

heights = np.array(heights)
weights = np.array(weights)
bmi = np.round(weights / ((heights / 100) ** 2), 2)
age = np.random.randint(18, 65, size=n_people)
calories = np.round(1600 + weights * 12 + np.random.normal(0, 200, n_people))
activity_hours = np.round(np.random.exponential(scale=3.5, size=n_people), 1)

df_hw = pd.DataFrame({
    "Person_ID": person_ids,
    "Gender": genders,
    "Height_cm": heights,
    "Weight_kg": weights,
    "BMI": bmi,
    "Age": age,
    "Daily_Calories": calories,
    "Activity_Hours_Per_Week": activity_hours
})

df_hw.to_csv("backend/data/heights_weights.csv", index=False)

# 3. Daily Temperatures & Weather Dataset (90 days - 3 months)
dates = pd.date_range(start="2026-06-01", periods=90, freq="D").strftime("%Y-%m-%d")
# Seasonal drift + stochastic noise
trend = np.linspace(24, 34, 90) + 3.0 * np.sin(np.linspace(0, 3*np.pi, 90))
avg_temp = np.round(trend + np.random.normal(0, 2.2, 90), 1)
max_temp = np.round(avg_temp + np.random.uniform(4.0, 9.0, 90), 1)
min_temp = np.round(avg_temp - np.random.uniform(3.5, 7.5, 90), 1)
humidity = np.clip(np.round(80 - 1.2 * (avg_temp - 24) + np.random.normal(0, 8, 90), 1), 30, 98)
wind_speed = np.round(np.random.weibull(a=1.8, size=90) * 12 + 3, 1) # Skewed wind speed
pressure_hpa = np.round(1013.25 + np.random.normal(0, 4.5, 90), 1)

df_weather = pd.DataFrame({
    "Date": dates,
    "Avg_Temperature_C": avg_temp,
    "Max_Temperature_C": max_temp,
    "Min_Temperature_C": min_temp,
    "Humidity_Percent": humidity,
    "Wind_Speed_kmh": wind_speed,
    "Atmospheric_Pressure_hPa": pressure_hpa
})

df_weather.to_csv("backend/data/daily_temperatures.csv", index=False)
print("Sample datasets generated successfully!")
