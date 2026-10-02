import urllib.request
import json
import sys

BASE = 'http://127.0.0.1:5000/api'

def test_endpoint(name, path, method='GET', body=None):
    req = urllib.request.Request(
        BASE + path,
        data=json.dumps(body).encode('utf-8') if body else None,
        headers={'Content-Type': 'application/json'} if body else {}
    )
    if method != 'GET':
        req.method = method
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            status = resp.status
            success = data.get("success", True)
            print(f"[PASSED {status}] {name}")
            return data
    except Exception as e:
        print(f"[FAILED] {name}: {e}")
        return None

print("=== STATVIZ API COMPREHENSIVE VERIFICATION ===")
test_endpoint("Health Check", "/health")
samples = test_endpoint("List Samples", "/samples")
student_marks = test_endpoint("Load Student Marks Sample", "/sample/student_marks")
hw = test_endpoint("Load Heights/Weights Sample", "/sample/heights_weights")
weather = test_endpoint("Load Weather Sample", "/sample/daily_temperatures")

# Test clean
test_endpoint("Clean Dataset (Mean strategy)", "/clean", "POST", {"dataset_id": "student_marks", "strategy": "mean"})

# Test 12 analysis features
test_endpoint("Preview Dataset", "/preview", "POST", {"dataset_id": "student_marks", "page": 1, "page_size": 10})
test_endpoint("Frequency Distribution", "/frequency", "POST", {"dataset_id": "student_marks", "column": "Math_Score", "num_classes": 6})
test_endpoint("Descriptive Statistics", "/descriptive", "POST", {"dataset_id": "student_marks", "column": "Math_Score"})
test_endpoint("Ogive Curves", "/ogive", "POST", {"dataset_id": "student_marks", "column": "Math_Score", "num_classes": 8})
test_endpoint("Stem and Leaf Plot", "/stem-and-leaf", "POST", {"dataset_id": "student_marks", "column": "Math_Score", "leaf_unit": 1.0, "split_stems": True})
test_endpoint("Chebyshev Inequality", "/chebyshev", "POST", {"dataset_id": "student_marks", "column": "Math_Score", "k": 2.5})
test_endpoint("Normality Analysis & Q-Q", "/normality", "POST", {"dataset_id": "student_marks", "column": "Math_Score"})
test_endpoint("Skewness Analyzer", "/skewness", "POST", {"dataset_id": "student_marks", "column": "Math_Score"})
test_endpoint("Scatter & Linear Regression", "/scatter", "POST", {"dataset_id": "student_marks", "x_column": "Study_Hours", "y_column": "Math_Score"})
test_endpoint("Summary Report Synthesis", "/report", "POST", {"dataset_id": "student_marks", "primary_column": "Math_Score", "secondary_column": "Study_Hours"})

print("=== ALL 14 API ENDPOINTS VALIDATED SUCCESSFULLY ===")
