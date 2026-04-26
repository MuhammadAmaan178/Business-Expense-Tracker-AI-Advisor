import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = "llama-3.3-70b-versatile"

class AIAdvisor:
    def __init__(self):
        self.api_key = GROQ_API_KEY
        self.enabled = bool(self.api_key and self.api_key != "your_api_key_here")

    def get_advice(self, analysis_dict, filter_context=None):
        # Return a placeholder message until the API key is set in .env
        if not self.enabled:
            return (
                "AI Advisor is currently disabled. "
                "To enable it, open the .env file and replace 'your_api_key_here' "
                "with your actual Groq API key from https://console.groq.com"
            )

        # Import Groq only when the key is available
        from groq import Groq
        client = Groq(api_key=self.api_key)

        context_str = filter_context if filter_context else "All Data"

        prompt = f"""
        Analysis Context: {context_str}

        Key Financial Metrics:
        - Total Records: {analysis_dict['total_records']}
        - Total Amount (Raw): {analysis_dict['total_amount_raw']:.2f}
        - Total Tax Collected: {analysis_dict['total_tax_collected']:.2f}
        - Total Turnover: {analysis_dict['total_turnover']:.2f}
        - Average Transaction: {analysis_dict['avg_transaction']:.2f}
        - Highest Transaction: {analysis_dict['highest_transaction']:.2f}
        - Lowest Transaction: {analysis_dict['lowest_transaction']:.2f}
        - Standard Deviation: {analysis_dict['std_deviation']:.2f}
        - Paid vs Pending: {analysis_dict['paid_count']} Paid, {analysis_dict['pending_count']} Pending
        - Priority Breakdown: {analysis_dict['high_priority_count']} High, {analysis_dict['medium_priority_count']} Medium, {analysis_dict['low_priority_count']} Low

        Category Breakdown:
        {analysis_dict['category_breakdown']}

        Please provide spending insights, identify any anomalies, offer cost-saving recommendations,
        and assess overall financial health.
        """

        system_prompt = """You are a concise financial advisor for a Pakistani business.

STRICT RULES:
- Respond ONLY under these 5 headers: COST ANALYSIS, ANOMALIES DETECTED, TOP RECOMMENDATIONS, FINANCIAL HEALTH, PRIORITY REVIEW
- Maximum 2 points per section. Each point max 1 sentence.
- Never mention data errors, negative values, or data quality issues. The data is clean.
- No intros, no conclusions, no explanations. Just the 5 sections.
- Amounts in PKR. Be specific with numbers.
- Start each point with a dash (-)
- NEVER use ##, **, *, or any markdown symbols anywhere in your response."""

        user_prompt = f"""
Analyze this business expense data and give insights under these 5 headings:

COST ANALYSIS
ANOMALIES DETECTED  
TOP RECOMMENDATIONS
FINANCIAL HEALTH
PRIORITY REVIEW

Data Summary:
- Total Records: {analysis_dict['total_records']}
- Total Turnover (PKR): {analysis_dict['total_turnover']:,.2f}
- Total Tax Collected (PKR): {analysis_dict['total_tax_collected']:,.2f}
- Average Transaction (PKR): {analysis_dict['avg_transaction']:,.2f}
- Highest Transaction (PKR): {analysis_dict['highest_transaction']:,.2f}
- Lowest Transaction (PKR): {analysis_dict['lowest_transaction']:,.2f}
- Std Deviation: {analysis_dict['std_deviation']:,.2f}
- Paid Transactions: {analysis_dict['paid_count']}
- Pending Payments: {analysis_dict['pending_count']}
- High Priority: {analysis_dict['high_priority_count']}
- Medium Priority: {analysis_dict['medium_priority_count']}
- Low Priority: {analysis_dict['low_priority_count']}
- Context: {context_str}

Category Breakdown:
{chr(10).join([f"  {cat}: PKR {vals['total_amount']:,.0f} ({vals['count']} transactions)" for cat, vals in analysis_dict['category_breakdown'].items()])}
"""

        try:
            completion = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user",   "content": user_prompt}
                ],
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f"Error connecting to AI Advisor: {str(e)}"
