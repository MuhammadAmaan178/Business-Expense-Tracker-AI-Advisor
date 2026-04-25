import requests
import json
import sys
import io

# Fix Windows encoding for emoji output
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BASE_URL = "http://localhost:5000/api"
passed = 0
total = 11

def print_result(test_name, response, expect_status=200):
    global passed
    try:
        status_code = response.status_code
        body = response.json()

        # Determine expected conditions
        if status_code == expect_status:
            print(f"✅ PASS — {test_name} | Status: {status_code}")
            passed += 1
        else:
            err = body.get("error", "Unknown error")
            print(f"❌ FAIL — {test_name} | Status: {status_code} | Error: {err}")
    except Exception as e:
        print(f"❌ FAIL — {test_name} | Exception: {str(e)}")

# ─────────────────────────────────────────────────────────────────────────────
# TEST 1: Health Check
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/health")
print_result("GET /api/health", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 2: Add Valid Transaction
# ─────────────────────────────────────────────────────────────────────────────
valid_payload = {
    "Transaction_ID": "TXN_TEST_001",
    "Date": "2024-07-15",
    "Transaction_Type": "Expense",
    "Category": "Marketing",
    "Item_Description": "Social Media Ad Campaign Q3",
    "Amount_Raw": 15000.00,
    "Vendor_Supplier": "Meta Ads",
    "Payment_Method": "Credit Card"
}
r = requests.post(f"{BASE_URL}/transactions/add", json=valid_payload)
print_result("POST /api/transactions/add (valid)", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 3: Add Incomplete Transaction (missing Amount_Raw) — expect 400
# ─────────────────────────────────────────────────────────────────────────────
incomplete_payload = {
    "Transaction_ID": "TXN_TEST_002",
    "Date": "2024-07-16",
    "Transaction_Type": "Expense",
    "Category": "Salaries",
    "Item_Description": "Monthly payroll",
    "Vendor_Supplier": "HR Department",
    "Payment_Method": "Bank Transfer"
    # Amount_Raw intentionally missing
}
r = requests.post(f"{BASE_URL}/transactions/add", json=incomplete_payload)
print_result("POST /api/transactions/add (missing Amount_Raw → 400)", r, expect_status=400)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 4: Get All Transactions with Pagination
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/transactions", params={"page": 1, "per_page": 5})
print_result("GET /api/transactions?page=1&per_page=5", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 5: Filter by Category = Rent
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/transactions/filter", params={"category": "Rent"})
print_result("GET /api/transactions/filter?category=Rent", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 6: Filter by Priority=High AND Payment_Status=Paid
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/transactions/filter", params={"priority": "High", "payment_status": "Paid"})
print_result("GET /api/transactions/filter?priority=High&payment_status=Paid", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 7: Filter by Date Range
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/transactions/filter", params={"date_from": "2024-01-01", "date_to": "2024-06-30"})
print_result("GET /api/transactions/filter?date_from=2024-01-01&date_to=2024-06-30", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 8: Search Transactions
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/transactions/search", params={"q": "electricity"})
print_result("GET /api/transactions/search?q=electricity", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 9: Full Dataset Analysis
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/analysis")
print_result("GET /api/analysis", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 10: Filtered Analysis — Category=Marketing
# ─────────────────────────────────────────────────────────────────────────────
r = requests.get(f"{BASE_URL}/analysis/filter", params={"category": "Marketing"})
print_result("GET /api/analysis/filter?category=Marketing", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# TEST 11: AI Advice
# ─────────────────────────────────────────────────────────────────────────────
r = requests.post(f"{BASE_URL}/ai-advice", json={"filter_context": "Category: Marketing", "category": "Marketing"})
print_result("POST /api/ai-advice (Category: Marketing)", r, expect_status=200)

# ─────────────────────────────────────────────────────────────────────────────
# Final Summary
# ─────────────────────────────────────────────────────────────────────────────
print(f"\n🎯 Results: {passed}/{total} tests passed")
