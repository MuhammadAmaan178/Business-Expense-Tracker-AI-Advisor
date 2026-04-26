from flask import Flask, request, jsonify
from flask_cors import CORS
from business_logic import BusinessLogic
from ai_advisor import AIAdvisor
import traceback

app = Flask(__name__)
CORS(app)

# Initialize Logic and AI
logic = BusinessLogic('cleaned_business_data.csv')
advisor = AIAdvisor()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "success", "message": "Server is running perfectly"})

@app.route('/api/transactions/add', methods=['POST'])
def add_transaction():
    try:
        data = request.json
        result = logic.add_transaction(data)
        return jsonify({"status": "success", "data": result, "message": "Transaction added successfully"})
    except ValueError as e:
        return jsonify({"status": "error", "error": str(e), "code": 400}), 400
    except Exception as e:
        return jsonify({"status": "error", "error": str(e), "code": 500}), 500

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=20, type=int)
        result = logic.get_all_transactions(page=page, per_page=per_page)
        return jsonify({"status": "success", "data": result, "message": "Transactions retrieved"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e), "code": 500}), 500

@app.route('/api/transactions/filter', methods=['GET'])
def filter_transactions():
    try:
        params = {
            'category': request.args.get('category'),
            'priority': request.args.get('priority'),
            'transaction_type': request.args.get('transaction_type'),
            'payment_method': request.args.get('payment_method'),
            'payment_status': request.args.get('payment_status'),
            'date_from': request.args.get('date_from'),
            'date_to': request.args.get('date_to')
        }
        filtered_df = logic.filter_transactions(**params)
        result = filtered_df.to_dict(orient='records')
        return jsonify({"status": "success", "data": result, "message": "Filtered transactions retrieved"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e), "code": 500}), 500

@app.route('/api/transactions/search', methods=['GET'])
def search_transactions():
    try:
        keyword = request.args.get('q', default='')
        result = logic.search_transactions(keyword)
        return jsonify({"status": "success", "data": result, "message": f"Search results for '{keyword}'"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e), "code": 500}), 500

@app.route('/api/analysis', methods=['GET'])
def get_analysis():
    try:
        result = logic.get_analysis()
        return jsonify({"status": "success", "data": result, "message": "Full dataset analysis complete"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e), "code": 500}), 500

@app.route('/api/analysis/filter', methods=['GET'])
def get_filtered_analysis():
    try:
        params = {
            'category': request.args.get('category'),
            'priority': request.args.get('priority'),
            'transaction_type': request.args.get('transaction_type'),
            'payment_method': request.args.get('payment_method'),
            'payment_status': request.args.get('payment_status'),
            'date_from': request.args.get('date_from'),
            'date_to': request.args.get('date_to')
        }
        filtered_df = logic.filter_transactions(**params)
        result = logic.get_analysis(filtered_df)
        return jsonify({"status": "success", "data": result, "message": "Filtered analysis complete"})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e), "code": 500}), 500

@app.route('/api/ai-advice', methods=['POST'])
def get_ai_advice():
    try:
        # Accept filter context + filter params
        body = request.json or {}
        filter_context = body.get('filter_context', 'Custom Filter')
        
        # We can also pass filter params in the POST body or as query params
        # For simplicity, let's look at query params first, then body
        params = {
            'category': request.args.get('category') or body.get('category'),
            'priority': request.args.get('priority') or body.get('priority'),
            'transaction_type': request.args.get('transaction_type') or body.get('transaction_type'),
            'payment_method': request.args.get('payment_method') or body.get('payment_method'),
            'payment_status': request.args.get('payment_status') or body.get('payment_status'),
            'date_from': request.args.get('date_from') or body.get('date_from'),
            'date_to': request.args.get('date_to') or body.get('date_to')
        }
        
        filtered_df = logic.filter_transactions(**params)
        analysis = logic.get_analysis(filtered_df)
        
        advice = advisor.get_advice(analysis, filter_context)
        return jsonify({"status": "success", "data": advice, "message": "AI advice generated"})
    except Exception as e:
        traceback.print_exc()
        return jsonify({"status": "error", "error": str(e), "code": 500}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)
