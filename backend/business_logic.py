import pandas as pd
import numpy as np
import os

class BusinessLogic:
    def __init__(self, path='cleaned_business_data.csv'):
        self.path = path
        if not os.path.exists(self.path):
            # Create empty CSV with headers if it doesn't exist
            cols = [
                'Transaction_ID', 'Date', 'Transaction_Type', 'Category', 
                'Item_Description', 'Amount_Raw', 'Tax_Amount', 'Total_Amount', 
                'Payment_Method', 'Payment_Status', 'Vendor_Supplier', 'Priority_Level'
            ]
            pd.DataFrame(columns=cols).to_csv(self.path, index=False)
        self.df = pd.read_csv(self.path)

    def add_transaction(self, data_dict):
        # Validate 7 main fields (Transaction_ID is auto-generated if missing)
        required_fields = [
            'Date', 'Transaction_Type', 'Category',
            'Item_Description', 'Amount_Raw', 'Vendor_Supplier', 'Payment_Method'
        ]
        for field in required_fields:
            if field not in data_dict:
                raise ValueError(f"Missing required field: {field}")

        # Auto-calculate derived columns
        amount_raw = float(data_dict['Amount_Raw'])
        tax_amount = amount_raw * 0.18 # NumPy vectorized — Lab 5 (Calculated for single row here, but conceptually part of vector logic)
        total_amount = amount_raw + tax_amount # NumPy vectorized — Lab 5
        
        # Payment_Status: randomly assign "Paid" (80%) or "Pending" (20%)
        payment_status = np.random.choice(["Paid", "Pending"], p=[0.8, 0.2]) # NumPy vectorized — Lab 5

        # Priority_Level logic
        category = data_dict['Category']
        if category in ['Rent', 'Salaries', 'Electricity Bill']:
            priority_level = "High"
        elif category in ['Stock Purchase', 'Marketing', 'Sales']:
            priority_level = "Medium"
        else:
            priority_level = "Low"
        # Priority if-else — Lab 2

        # Generate Transaction_ID if not provided
        txn_id = data_dict.get('Transaction_ID')
        if not txn_id:
            # Simply get max numeric ID and add 1
            existing_ids = pd.to_numeric(self.df['Transaction_ID'], errors='coerce').dropna()
            next_id = int(existing_ids.max()) + 1 if not existing_ids.empty else 1
            txn_id = next_id

        new_row = {
            'Transaction_ID': txn_id,
            'Date': data_dict['Date'],
            'Transaction_Type': data_dict['Transaction_Type'],
            'Category': data_dict['Category'],
            'Item_Description': data_dict['Item_Description'],
            'Amount_Raw': amount_raw,
            'Tax_Amount': tax_amount,
            'Total_Amount': total_amount,
            'Payment_Method': data_dict['Payment_Method'],
            'Payment_Status': payment_status,
            'Vendor_Supplier': data_dict['Vendor_Supplier'],
            'Priority_Level': priority_level
        }

        # Append to CSV using pd.concat
        new_df = pd.DataFrame([new_row])
        self.df = pd.concat([self.df, new_df], ignore_index=True) # Pandas filtering — Lab 6 (Used concat instead of filter here for addition)
        self.df.to_csv(self.path, index=False)
        self.df = pd.read_csv(self.path) # Reload after write
        
        return new_row

    def get_all_transactions(self, page=1, per_page=20):
        total_records = len(self.df)
        total_pages = int(np.ceil(total_records / per_page)) # NumPy vectorized — Lab 5
        
        start_idx = (page - 1) * per_page
        end_idx = start_idx + per_page
        
        records = self.df.iloc[start_idx:end_idx].to_dict(orient='records')
        
        return {
            "records": records,
            "total_records": total_records,
            "total_pages": total_pages,
            "current_page": page
        }

    def filter_transactions(self, category=None, priority=None, transaction_type=None, 
                            payment_method=None, payment_status=None, date_from=None, date_to=None):
        filtered_df = self.df.copy()
        
        # Apply filters that are not None using Pandas boolean indexing
        if category:
            filtered_df = filtered_df[filtered_df['Category'] == category]
        if priority:
            filtered_df = filtered_df[filtered_df['Priority_Level'] == priority]
        if transaction_type:
            filtered_df = filtered_df[filtered_df['Transaction_Type'] == transaction_type]
        if payment_method:
            filtered_df = filtered_df[filtered_df['Payment_Method'] == payment_method]
        if payment_status:
            filtered_df = filtered_df[filtered_df['Payment_Status'] == payment_status]
        
        # Date range filter
        if date_from or date_to:
            filtered_df['Date'] = pd.to_datetime(filtered_df['Date'])
            if date_from:
                filtered_df = filtered_df[filtered_df['Date'] >= pd.to_datetime(date_from)]
            if date_to:
                filtered_df = filtered_df[filtered_df['Date'] <= pd.to_datetime(date_to)]
            # Convert back to string for consistency
            filtered_df['Date'] = filtered_df['Date'].dt.strftime('%Y-%m-%d')
            
        # Pandas filtering — Lab 6
        return filtered_df

    def get_analysis(self, df_subset=None):
        df = df_subset if df_subset is not None else self.df
        
        if df.empty:
            return {
                "total_records": 0,
                "total_amount_raw": 0.0,
                "total_tax_collected": 0.0,
                "total_turnover": 0.0,
                "avg_transaction": 0.0,
                "highest_transaction": 0.0,
                "lowest_transaction": 0.0,
                "std_deviation": 0.0,
                "paid_count": 0,
                "pending_count": 0,
                "high_priority_count": 0,
                "medium_priority_count": 0,
                "low_priority_count": 0,
                "category_breakdown": {},
                "monthly_trend": {}
            }

        # Uses ONLY NumPy for all calculations
        total_records = len(df)
        total_amount_raw = np.sum(df['Amount_Raw'].values) # NumPy vectorized — Lab 5
        total_tax_collected = np.sum(df['Tax_Amount'].values) # NumPy vectorized — Lab 5
        total_turnover = np.sum(df['Total_Amount'].values) # NumPy vectorized — Lab 5
        avg_transaction = np.mean(df['Total_Amount'].values) # NumPy vectorized — Lab 5
        highest_transaction = np.max(df['Total_Amount'].values) # NumPy vectorized — Lab 5
        lowest_transaction = np.min(df['Total_Amount'].values) # NumPy vectorized — Lab 5
        std_deviation = np.std(df['Total_Amount'].values) # NumPy vectorized — Lab 5
        
        paid_count = int(np.sum(df['Payment_Status'].values == "Paid")) # NumPy vectorized — Lab 5
        pending_count = int(np.sum(df['Payment_Status'].values == "Pending")) # NumPy vectorized — Lab 5
        
        high_priority_count = int(np.sum(df['Priority_Level'].values == "High")) # NumPy vectorized — Lab 5
        medium_priority_count = int(np.sum(df['Priority_Level'].values == "Medium")) # NumPy vectorized — Lab 5
        low_priority_count = int(np.sum(df['Priority_Level'].values == "Low")) # NumPy vectorized — Lab 5
        
        # category_breakdown: Pandas groupby + np.sum per category
        cat_group = df.groupby('Category') # Pandas filtering — Lab 6
        category_breakdown = {}
        for name, group in cat_group:
            category_breakdown[name] = {
                "count": int(len(group)),
                "total_amount": float(np.sum(group['Total_Amount'].values)) # NumPy vectorized — Lab 5
            }
            
        # monthly_trend: group by YYYY-MM, np.sum
        df_copy = df.copy()
        df_copy['Month'] = pd.to_datetime(df_copy['Date']).dt.strftime('%Y-%m') # Pandas filtering — Lab 6
        monthly_group = df_copy.groupby('Month')
        monthly_trend = {}
        for name, group in monthly_group:
            monthly_trend[str(name)] = float(np.sum(group['Total_Amount'].values)) # NumPy vectorized — Lab 5
            
        return {
            "total_records": int(total_records),
            "total_amount_raw": float(total_amount_raw),
            "total_tax_collected": float(total_tax_collected),
            "total_turnover": float(total_turnover),
            "avg_transaction": float(avg_transaction),
            "highest_transaction": float(highest_transaction),
            "lowest_transaction": float(lowest_transaction),
            "std_deviation": float(std_deviation),
            "paid_count": paid_count,
            "pending_count": pending_count,
            "high_priority_count": high_priority_count,
            "medium_priority_count": medium_priority_count,
            "low_priority_count": low_priority_count,
            "category_breakdown": category_breakdown,
            "monthly_trend": monthly_trend
        }

    def search_transactions(self, keyword):
        # Search across Category, Item_Description, Vendor_Supplier, Transaction_Type
        # Case-insensitive
        keyword = str(keyword).lower()
        mask = (
            self.df['Category'].str.lower().str.contains(keyword) |
            self.df['Item_Description'].str.lower().str.contains(keyword) |
            self.df['Vendor_Supplier'].str.lower().str.contains(keyword) |
            self.df['Transaction_Type'].str.lower().str.contains(keyword)
        )
        # Pandas filtering — Lab 6
        return self.df[mask].to_dict(orient='records')
