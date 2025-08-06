export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type ExpenseCategory = 
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other'
];

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'all';
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface ExpenseSummary {
  totalSpending: number;
  monthlySpending: number;
  categoryBreakdown: Record<ExpenseCategory, number>;
  topCategory: ExpenseCategory | null;
  expenseCount: number;
}