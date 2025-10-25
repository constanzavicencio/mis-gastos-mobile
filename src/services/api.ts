import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const expenseService = {
  getExpenses: () => api.get('/expenses'),
  addExpense: (expense: any) => api.post('/expenses', expense),
  updateExpense: (id: string, expense: any) => api.put(`/expenses/${id}`, expense),
  deleteExpense: (id: string) => api.delete(`/expenses/${id}`),
};

export const budgetService = {
  getBudgets: () => api.get('/budgets'),
  addBudget: (budget: any) => api.post('/budgets', budget),
  updateBudget: (id: string, budget: any) => api.put(`/budgets/${id}`, budget),
  deleteBudget: (id: string) => api.delete(`/budgets/${id}`),
};

export const savingsService = {
  getSavings: () => api.get('/savings'),
  addSavings: (savings: any) => api.post('/savings', savings),
  updateSavings: (id: string, savings: any) => api.put(`/savings/${id}`, savings),
  deleteSavings: (id: string) => api.delete(`/savings/${id}`),
};