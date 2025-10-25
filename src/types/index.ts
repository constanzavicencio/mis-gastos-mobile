export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Category {
  id: string;
  name: string;
  type?: 'expense' | 'income' | 'inventory';
  color?: string;
  icon?: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Expense {
  id: string;
  amount: number;
  occurredAt: string;
  description: string;
  notes?: string;
  categoryId?: string;
  subcategoryId?: string;
  category?: Category;
  subcategory?: Subcategory;
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpensePayload {
  amount: number;
  occurredAt: string;
  description: string;
  notes?: string;
  categoryId?: string;
  subcategoryId?: string;
}

export interface ExpenseFilters {
  from?: string;
  to?: string;
  categoryId?: string;
  subcategoryId?: string;
}

export type BudgetPeriod = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface Budget {
  id: string;
  amount: number;
  period: BudgetPeriod;
  categoryId?: string;
  subcategoryId?: string;
  category?: Category;
  subcategory?: Subcategory;
  notes?: string;
}

export interface BudgetSummaryItem {
  id: string;
  name: string;
  type: 'category' | 'subcategory';
  budgeted: number;
  actual: number;
  variance: number;
  period: BudgetPeriod;
}

export type ScheduleType =
  | 'FIXED_DATE'
  | 'BUSINESS_DAY'
  | 'DATE_RANGE'
  | 'BUSINESS_DAY_RANGE';

export interface ScheduledItem {
  id: string;
  name: string;
  amount: number;
  currency?: string;
  scheduleType: ScheduleType;
  dayOfMonth?: number;
  businessDay?: number;
  startDay?: number;
  endDay?: number;
  startBusinessDay?: number;
  endBusinessDay?: number;
  activeFromMonth?: string;
  activeToMonth?: string;
  notes?: string;
}

export interface Income extends ScheduledItem {
  type: 'income';
}

export interface Subscription extends ScheduledItem {
  type: 'subscription';
}

export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  consumptionPerDay: number;
  purchaseQuantity: number;
  purchaseUnit?: string;
  purchaseCost?: number;
  stockOnHand: number;
  reminderLeadTimeDays?: number;
  nextPurchaseDate?: string;
  projectedRunOutDate?: string;
  lastPurchaseDate?: string;
  categoryId?: string;
  subcategoryId?: string;
}

export interface InventoryPurchase {
  id: string;
  itemId: string;
  quantity: number;
  cost?: number;
  purchasedAt: string;
}

export interface PlannerEvent {
  id: string;
  title: string;
  type: 'income' | 'subscription' | 'inventory';
  scheduledFor: string;
  amount?: number;
  itemId?: string;
  referenceId?: string;
  metadata?: Record<string, unknown>;
}

export interface ApiListResponse<T> {
  data: T;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  details?: unknown;
}
