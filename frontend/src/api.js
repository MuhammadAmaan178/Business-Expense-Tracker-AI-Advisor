const BASE_URL = 'http://127.0.0.1:5000/api';

export const fetchHealth = async () => {
  const response = await fetch(`${BASE_URL}/health`);
  return response.json();
};

export const addTransaction = async (transactionData) => {
  const response = await fetch(`${BASE_URL}/transactions/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transactionData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to add transaction');
  }
  return response.json();
};

export const fetchTransactions = async (page = 1, perPage = 20) => {
  const response = await fetch(`${BASE_URL}/transactions?page=${page}&per_page=${perPage}`);
  return response.json();
};

export const filterTransactions = async (params) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/transactions/filter?${query}`);
  return response.json();
};

export const searchTransactions = async (keyword) => {
  const response = await fetch(`${BASE_URL}/transactions/search?q=${encodeURIComponent(keyword)}`);
  return response.json();
};

export const fetchAnalysis = async () => {
  const response = await fetch(`${BASE_URL}/analysis`);
  return response.json();
};

export const fetchFilteredAnalysis = async (params) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/analysis/filter?${query}`);
  return response.json();
};

export const fetchAIAdvice = async (context, params = {}) => {
  const response = await fetch(`${BASE_URL}/ai-advice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filter_context: context, ...params }),
  });
  return response.json();
};
