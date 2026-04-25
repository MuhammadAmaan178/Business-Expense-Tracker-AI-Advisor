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

        system_prompt = (
            "You are a professional business financial advisor. "
            "Analyze the provided business expense data and give clear, actionable advice in 4-5 bullet points."
        )

        try:
            completion = client.chat.completions.create(
                model=MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": prompt}
                ],
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f"Error connecting to AI Advisor: {str(e)}"
