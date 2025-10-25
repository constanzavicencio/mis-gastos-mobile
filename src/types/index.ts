export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  userId: string;
}

export interface Budget {
  id: string;
  amount: number;
  category: string;
  period: 'monthly' | 'yearly';
  userId: string;
}

export interface Savings {
  id: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
  targetDate: string;
  userId: string;
}