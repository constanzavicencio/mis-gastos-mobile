import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import {
  Budget,
  BudgetSummaryItem,
  Expense,
  ExpenseFilters,
  ExpensePayload,
  Income,
  InventoryItem,
  InventoryPurchase,
  PlannerEvent,
  Subscription,
  Category,
  Subcategory,
} from '../types';

const baseUrl = (() => {
  const sanitized = API_URL?.replace(/\/$/, '') ?? '';
  if (!sanitized) {
    return '/api';
  }
  return sanitized.endsWith('/api') ? sanitized : `${sanitized}/api`;
})();

const api = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const categoryService = {
  getCategories: () => api.get<Category[]>('/categories'),
  createCategory: (payload: Partial<Category>) => api.post<Category>('/categories', payload),
  updateCategory: (id: string, payload: Partial<Category>) =>
    api.put<Category>(`/categories/${id}`, payload),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
  createSubcategory: (categoryId: string, payload: Partial<Subcategory>) =>
    api.post<Subcategory>(`/categories/${categoryId}/subcategories`, payload),
  updateSubcategory: (id: string, payload: Partial<Subcategory>) =>
    api.put<Subcategory>(`/categories/subcategories/${id}`, payload),
  deleteSubcategory: (id: string) => api.delete(`/categories/subcategories/${id}`),
};

export const expenseService = {
  getExpenses: (filters?: ExpenseFilters) =>
    api.get<Expense[]>('/expenses', { params: filters }),
  getExpense: (id: string) => api.get<Expense>(`/expenses/${id}`),
  addExpense: (payload: ExpensePayload) => api.post<Expense>('/expenses', payload),
  updateExpense: (id: string, payload: ExpensePayload) =>
    api.put<Expense>(`/expenses/${id}`, payload),
  deleteExpense: (id: string) => api.delete(`/expenses/${id}`),
};

export const budgetService = {
  getBudgets: () => api.get<Budget[]>('/budgets'),
  addBudget: (payload: Partial<Budget>) => api.post<Budget>('/budgets', payload),
  updateBudget: (id: string, payload: Partial<Budget>) =>
    api.put<Budget>(`/budgets/${id}`, payload),
  deleteBudget: (id: string) => api.delete(`/budgets/${id}`),
  getSummary: (month: string) =>
    api.get<BudgetSummaryItem[]>(`/budgets/summary`, { params: { month } }),
};

export const incomeService = {
  getIncomes: () => api.get<Income[]>('/incomes'),
  addIncome: (payload: Partial<Income>) => api.post<Income>('/incomes', payload),
  updateIncome: (id: string, payload: Partial<Income>) =>
    api.put<Income>(`/incomes/${id}`, payload),
  deleteIncome: (id: string) => api.delete(`/incomes/${id}`),
};

export const subscriptionService = {
  getSubscriptions: () => api.get<Subscription[]>('/subscriptions'),
  addSubscription: (payload: Partial<Subscription>) =>
    api.post<Subscription>('/subscriptions', payload),
  updateSubscription: (id: string, payload: Partial<Subscription>) =>
    api.put<Subscription>(`/subscriptions/${id}`, payload),
  deleteSubscription: (id: string) => api.delete(`/subscriptions/${id}`),
};

export const inventoryService = {
  getInventory: () => api.get<InventoryItem[]>('/inventory'),
  addInventoryItem: (payload: Partial<InventoryItem>) =>
    api.post<InventoryItem>('/inventory', payload),
  getInventoryItem: (id: string) => api.get<InventoryItem>(`/inventory/${id}`),
  updateInventoryItem: (id: string, payload: Partial<InventoryItem>) =>
    api.put<InventoryItem>(`/inventory/${id}`, payload),
  deleteInventoryItem: (id: string) => api.delete(`/inventory/${id}`),
  getPurchases: (itemId: string) =>
    api.get<InventoryPurchase[]>(`/inventory/${itemId}/purchases`),
  addPurchase: (itemId: string, payload: Partial<InventoryPurchase>) =>
    api.post<InventoryPurchase>(`/inventory/${itemId}/purchases`, payload),
};

export const plannerService = {
  getUpcoming: (days = 60, include = 'incomes,subscriptions,inventory') =>
    api.get<PlannerEvent[]>(`/planner/upcoming`, { params: { days, include } }),
};

export default api;
