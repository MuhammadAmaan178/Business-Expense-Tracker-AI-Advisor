# DukaanLedger — Business Expense Tracker & AI Advisor

A modern, full-stack web application designed to help Pakistani retail businesses track daily income, expenses, and automatically gain actionable financial insights using AI.

## 🚀 Live Demo
(placeholder)

## 📋 Features
- **Dashboard & Analytics:** Real-time KPI tracking, category breakdowns, and dynamic charting for income and expenses.
- **Transaction Management:** Add, filter, search, and paginate through business transactions with auto-calculated taxes and priority levels.
- **AI Financial Advisor:** Integrated Groq AI (Llama 3.3 70B) that reads statistical summaries of filtered data to provide specific cost-saving, anomaly detection, and priority review advice.
- **Data Persistence:** Uses a lightweight Pandas-driven CSV backend, perfect for small-scale local businesses without the overhead of an SQL database.
- **Responsive UI:** A beautifully designed frontend tailored for desktop and mobile usability.

## 🛠️ Tech Stack
- **Backend:** Python, Flask, Pandas, NumPy, Groq AI API
- **Frontend:** React, Vite, Tailwind CSS, Lucide Icons

## 📁 Project Structure
```text
DukaanLedger/
├── backend/
│   ├── app.py                      # Main Flask application and API route definitions
│   ├── business_logic.py           # Core logic handling Pandas/NumPy operations on the CSV
│   ├── ai_advisor.py               # Handles the Groq API connection and prompt formatting
│   ├── cleaned_business_data.csv   # The primary local database storing all transactions
│   ├── .env                        # Environment variables (Groq API Key)
│   └── requirements.txt            # Python dependencies
└── frontend/
    ├── src/
    │   ├── App.jsx                 # Main React component, layout, and routing logic
    │   ├── api.js                  # Axios configurations mapping to Flask endpoints
    │   └── components/             # Reusable UI components (Dashboard, Forms, AI Panel, etc.)
    ├── package.json                # Node dependencies and project scripts
    └── vite.config.js              # Vite bundler configuration
```

## ⚙️ Installation & Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the Flask server:
   ```bash
   python app.py
   ```
   *(The server will start on `http://127.0.0.1:5000`)*

### Frontend

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *(The frontend will be available at `http://localhost:5173`)*

## 🔑 Environment Variables
You need an `.env` file in the `backend/` directory to enable the AI functionality.

```env
GROQ_API_KEY=your_api_key_here
```
- `GROQ_API_KEY`: Used by `ai_advisor.py` to authenticate with the Groq API and run the `llama-3.3-70b-versatile` model.

## 📡 API Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Health check to confirm server is running. |
| `POST` | `/api/transactions/add` | Adds a new transaction. Auto-calculates tax, total, and ID. |
| `GET` | `/api/transactions` | Retrieves all transactions with built-in pagination. |
| `GET` | `/api/transactions/filter` | Retrieves transactions matching specific filters (Date, Category, etc.). |
| `GET` | `/api/transactions/search` | Performs a text-based search across descriptions and vendors. |
| `GET` | `/api/analysis` | Returns full dataset statistical analysis using NumPy. |
| `GET` | `/api/analysis/filter` | Returns statistical analysis strictly for a filtered subset of data. |
| `POST` | `/api/ai-advice` | Sends stats to Groq AI and returns structured financial advice. |

## 👥 Team
(placeholder)

## 📄 License
MIT
