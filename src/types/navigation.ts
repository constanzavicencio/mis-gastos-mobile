import { NavigatorScreenParams } from '@react-navigation/native';
import { Expense } from './index';

export type OverviewStackParamList = {
  Overview: undefined;
  Budgets: undefined;
};

export type ExpensesStackParamList = {
  ExpensesList: undefined;
  ExpenseForm: { expense?: Expense } | undefined;
};

export type PlannerStackParamList = {
  Planner: undefined;
  Incomes: undefined;
  Subscriptions: undefined;
};

export type InventoryStackParamList = {
  InventoryList: undefined;
  InventoryDetail: { itemId: string; title: string };
  InventoryPurchase: { itemId: string; title: string };
};

export type RootTabParamList = {
  OverviewTab: NavigatorScreenParams<OverviewStackParamList>;
  ExpensesTab: NavigatorScreenParams<ExpensesStackParamList>;
  PlannerTab: NavigatorScreenParams<PlannerStackParamList>;
  InventoryTab: NavigatorScreenParams<InventoryStackParamList>;
};
