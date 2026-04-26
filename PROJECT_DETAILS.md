# DukaanLedger — Complete Project Details
## For: University Report / Viva Preparation

---

### 1. WHAT IS THIS PROJECT?

**What problem does it solve:**
Local shopkeepers and small retail businesses (like hardware stores, grocers, or pharmacies) often struggle to keep track of their daily money. They usually write things down on paper, which gets messy, or they use basic Excel sheets which don't give them smart advice. This project gives them a clean, digital ledger to track their income and expenses easily.

**Who would use it in real life:**
Any Pakistani small to medium business owner who wants a simple way to track what they earned, what they spent, and wants to understand where their money is going without needing to hire an accountant.

**What makes it different from a simple spreadsheet:**
Unlike a spreadsheet, DukaanLedger calculates things automatically (like 18% tax and priority levels), provides a beautiful visual dashboard with graphs, and most importantly, it has an "AI Advisor" built in. The AI acts like a virtual accountant, analyzing the business data to give specific, personalized advice on how to save money.

---

### 2. TECHNOLOGY USED AND WHY

- **Python:** Python is a very popular, easy-to-read programming language. We used it to build the "brain" of our application (the backend). It is perfect for handling data logic.
- **Pandas:** Pandas is a tool inside Python used to handle tables of data (like Excel rows and columns). In our project, it opens our CSV file, adds new rows to it, and helps filter data (like finding all transactions from "Last Week").
- **NumPy:** NumPy is a tool for doing heavy mathematical calculations quickly. We use it to find the highest expense, the lowest income, the average transaction amount, and the standard deviation (which tells us how much our spending fluctuates).
- **Flask:** Flask is a framework for Python that allows us to create a web server. It creates the "API". In simple words, an API is a messenger. When the user clicks "Save" on the website, the website asks the Flask API to deliver that data to Python, and Python saves it.
- **React:** React is a technology used to build the visual part of the website (the frontend) that the user actually sees and clicks on. Our friend built the frontend to make it look modern, fast, and responsive.
- **Groq AI:** Groq is a super-fast platform for running Artificial Intelligence models. We use their `llama-3.3-70b` model. We send it a summary of the shop's math (like totals and averages), and it reads it, thinks about it, and sends back smart financial advice in plain English.
- **CSV file:** A CSV (Comma Separated Values) file is just a simple text file that stores data like a spreadsheet. We used it instead of a complex database because it is lightweight, easy to read, and perfect for a university project without requiring complicated database installations.

---

### 3. COMPLETE FOLDER STRUCTURE

Here is an explanation of every important file in our project:

- **`backend/app.py`**
  This is the main server file. It listens for messages from the website. It holds all the "Endpoints" (the specific web addresses the frontend talks to).
- **`backend/business_logic.py`**
  This is the heavy lifter. Whenever `app.py` gets a request, it asks this file to do the actual work using Pandas and NumPy. It handles reading the CSV, calculating the math, creating the Transaction IDs, and filtering data.
- **`backend/ai_advisor.py`**
  This file only does one job: it talks to the Groq AI on the internet. It takes the mathematical summary, packages it into a strict prompt, sends it to the AI, and brings the response back.
- **`backend/cleaned_business_data.csv`**
  This is our "database". It is the actual file where all the transactions are permanently saved.
- **`backend/.env`**
  This is a secret file. It holds our private API Key for the Groq AI so that we don't accidentally share it with the world.
- **`backend/.gitignore`**
  A rulebook for Git (our version control) telling it to ignore certain files (like the secret `.env` file) so they don't get uploaded to the internet.
- **`frontend/`**
  This whole folder contains the visual website. Everything the user sees, clicks, and interacts with lives here.
- **`frontend/src/components/`**
  Inside the frontend, this folder holds individual building blocks of the website. For example, `Login.jsx` is just the login screen, `TransactionForm.jsx` is just the form, and `Dashboard.jsx` is just the graphs page.

---

### 4. THE 12 CSV COLUMNS — EXPLAINED

Our CSV file has exactly 12 columns. 

**The 8 "Input" Columns (Provided by the User):**
1. `Date` (When it happened)
2. `Transaction_Type` (Is it Income or Expense)
3. `Category` (E.g., Salaries, Utility Bills, Sales)
4. `Item_Description` (What exactly was bought/sold)
5. `Amount_Raw` (The base price before tax)
6. `Vendor_Supplier` (Who we paid or who paid us)
7. `Payment_Method` (Cash, Bank Transfer, Check)
8. `Payment_Status` (Paid, Pending, Refunded)

**The 4 "Derived" Columns (Calculated by the Backend Automatically):**
9. `Transaction_ID`: We calculate this by finding the highest existing ID number and adding 1 to it. (e.g. `14825` becomes `14826`).
10. `Tax_Amount`: The backend automatically applies an 18% GST tax. Formula: `Amount_Raw * 0.18`
11. `Total_Amount`: The final amount including the tax. Formula: `Amount_Raw + Tax_Amount`
12. `Priority_Level`: Automatically decided using an `if-else` block based on the Category:
   - "High": For Salaries, Rent, Utility Bills, Taxes
   - "Medium": For Stock Purchase, Marketing, Sales
   - "Low": For everything else (like Office Supplies or Maintenance)

---

### 5. HOW THE BACKEND WORKS — STEP BY STEP

**a) When the user fills the New Entry form and clicks Save:**
The frontend bundles the 8 inputs and sends a POST request to the backend. The backend calculates the Tax, Total, Priority, and ID. It creates a new row, uses Pandas to append it to the bottom of the CSV file, and saves the file.

**b) When the user opens the View Records page:**
The frontend sends a GET request to ask for the data. The backend uses Pandas to read the CSV, breaks it into pages (pagination, so it doesn't load 10,000 rows at once), and sends the first 100 rows back to the website to be displayed in the table.

**c) When the user applies a filter (e.g., "Only show Expenses"):**
The frontend sends a GET request with the filter details attached to the URL. The backend uses Pandas to search the CSV, throws away everything that isn't an "Expense", and sends only the matching rows back to the website.

**d) When the user clicks Get AI Insights:**
The frontend asks the backend to analyze whatever data is currently visible. The backend uses NumPy to calculate averages, standard deviations, and totals. It passes these numbers to `ai_advisor.py`, which sends them to Groq AI. Groq reads the numbers, writes 5 bullet points of advice, and sends it back to the screen.

---

### 6. ALL 8 API ENDPOINTS — EXPLAINED SIMPLY

1. **Health Check (`GET /api/health`)**
   - **Used by:** Nothing visually, just a developer tool to check if the server is awake.
2. **Add Transaction (`POST /api/transactions/add`)**
   - **Used by:** The "Save Transaction" button on the New Entry page.
   - **Data In:** The 8 input fields from the form.
   - **Data Out:** A success message saying the entry was saved.
3. **Get Transactions (`GET /api/transactions`)**
   - **Used by:** View Records page when it first loads.
   - **Data In:** Page number.
   - **Data Out:** A list of 100 rows of data.
4. **Filter Transactions (`GET /api/transactions/filter`)**
   - **Used by:** The left sidebar checkboxes on the View Records page.
   - **Data In:** Filter rules (like "Status = Paid").
   - **Data Out:** A list of data that matches those rules.
5. **Search Transactions (`GET /api/transactions/search`)**
   - **Used by:** The search bar at the top of the View Records page.
   - **Data In:** A typed word (like "Electricity").
   - **Data Out:** Rows where the description or vendor contains that word.
6. **Get Full Analysis (`GET /api/analysis`)**
   - **Used by:** The main Dashboard to draw the graphs and KPI cards.
   - **Data In:** Nothing.
   - **Data Out:** Mathematical totals (Total income, Total expense, Category counts).
7. **Get Filtered Analysis (`GET /api/analysis/filter`)**
   - **Used by:** The AI Insights box when you have filters active.
   - **Data In:** The same filter rules applied to the table.
   - **Data Out:** Mathematical totals for *only* the filtered data.
8. **Get AI Advice (`POST /api/ai-advice`)**
   - **Used by:** The "Get AI Insights" button.
   - **Data In:** What filters are active, and the data to analyze.
   - **Data Out:** The English text advice generated by the AI.

---

### 7. THE AI ADVISOR — HOW IT WORKS

- **What is Groq:** Groq is a company that runs AI models incredibly fast using special hardware.
- **What is llama-3.3-70b:** It is a massive, highly intelligent AI model created by Meta (Facebook), which we are running through Groq.
- **What data we send:** We DO NOT send the entire raw CSV file to the AI (that would be slow and insecure). Instead, our backend calculates a neat summary (Total spent, Highest transaction, Category counts) and we send only that short summary text.
- **What we get back:** The AI acts as a financial advisor and returns plain text advice.
- **The 5 Sections:** We strictly programmed the AI to only respond under 5 headers: Cost Analysis, Anomalies Detected, Top Recommendations, Financial Health, and Priority Review.

---

### 8. LAB CONCEPTS USED (for university marks)

- **Lab 1 & 2 (Variables, if-else logic):** Used heavily in `business_logic.py`. For example, we use `if-elif-else` statements to look at the "Category" column and decide if the "Priority_Level" should be High, Medium, or Low.
- **Lab 5 (NumPy vectorized calculations):** Used in the `get_analysis()` function. We convert Pandas columns into NumPy arrays to instantly calculate `.max()` (highest transaction), `.min()` (lowest transaction), `.mean()` (average), and `.std()` (standard deviation).
- **Lab 6 (Pandas CSV operations):** Used everywhere. We use `pd.read_csv()` to load the data, `df.to_csv()` to save new rows, and pandas filtering techniques (like `df[df['Category'] == 'Sales']`) to filter data without writing messy loop code.
- **OOP (Object-Oriented Programming):** We created a `BusinessLogic` Class. When the server starts, it creates an "Object" of this class. This is clean code practice, keeping all our Pandas/NumPy logic organized inside class methods instead of floating around loosely.

---

### 9. POSSIBLE VIVA QUESTIONS & ANSWERS

**1. Why did you use Flask instead of Django?**
Flask is a "micro-framework." It is lightweight and perfect for building a simple API to serve data to a React frontend. Django is too heavy and comes with a lot of built-in features we didn't need for this project.

**2. What is the difference between Amount_Raw and Total_Amount?**
`Amount_Raw` is the base price typed in by the user. `Total_Amount` is calculated automatically by the backend by adding an 18% Tax to the `Amount_Raw`.

**3. How does the AI give suggestions?**
We calculate mathematical summaries (like total expenses and averages) using NumPy, and we send those numbers to the Llama 3 AI model via the Groq API. The AI reads the numbers and generates business advice based on a prompt we wrote.

**4. What happens if two users submit a transaction at the exact same time?**
Since we are using a simple CSV file, there could be a "race condition" where they try to write to the file simultaneously, causing an error. In a real-world scenario, we would fix this by using a real database like PostgreSQL.

**5. Why use a CSV instead of a database like SQL?**
For the scope of this university project, a CSV is much easier to set up, requires no extra installations, and demonstrates our ability to use Pandas library for data manipulation.

**6. What is CORS and why did you enable it?**
CORS stands for Cross-Origin Resource Sharing. Because our React website runs on a different port (`5173`) than our Flask server (`5000`), the browser blocks them from talking to each other for security. We enabled `flask-cors` to allow them to communicate safely.

**7. How is Priority_Level decided?**
It uses an `if-else` condition in the backend. Crucial categories like Salaries and Rent get "High", operational things like Marketing get "Medium", and everything else gets "Low". 

**8. What does NumPy do that standard Python cannot?**
NumPy is written in C under the hood, making mathematical operations on huge columns of data incredibly fast compared to standard Python `for` loops. It also provides built-in statistical functions like standard deviation.

**9. What is an API?**
An API (Application Programming Interface) is like a waiter in a restaurant. The frontend (customer) asks the API for something (data), the API goes to the backend (kitchen), gets it, and brings it back to the frontend.

**10. How does pagination work in your project?**
Instead of sending all 10,000+ rows to the frontend (which would freeze the browser), Pandas slices the data using `.iloc[]` to only send 100 rows at a time based on the page number requested.

**11. What is the 18% GST and why is it there?**
It represents the standard General Sales Tax in Pakistan. We added it to demonstrate backend auto-calculation so the user doesn't have to do the math manually.

**12. How does the filter work in the backend?**
We receive the filter rules from the URL. Then we use Pandas boolean indexing. For example, to filter by income, we do: `df = df[df['Transaction_Type'] == 'Income']`.

**13. What is a REST API?**
It's a set of rules for how APIs should communicate using standard HTTP methods like GET (to read data) and POST (to send data). Our project follows this standard.

**14. Why did you change the Transaction_ID logic?**
Initially, we used timestamps for IDs, but it looked messy. We updated it using Pandas to read the CSV, find the highest numeric ID, and simply add 1 to it so it stays sequential and clean.

**15. What would you improve if you had more time?**
We would replace the CSV with a proper SQL database, add a real user login system with passwords, and allow users to upload receipts as images.

---

### 10. PROJECT LIMITATIONS

**What this project cannot do currently:**
- It is a single-user system. The login screen is a simulation; anyone can log in, and there are no separate accounts for different businesses.
- It is not meant for massive scale. If the CSV file hits millions of rows, Pandas will eventually run out of RAM and crash because it loads the whole file into memory.
- There is no way to edit or delete a transaction once it is saved from the website (you have to manually open the CSV file to delete a row).

**What would be added in a real production version:**
- A proper relational database (like PostgreSQL or MySQL).
- JWT (JSON Web Tokens) for secure, multi-user authentication.
- Full CRUD features (Create, Read, Update, Delete) from the UI.
- Export options (letting users download their filtered data as a PDF report).
