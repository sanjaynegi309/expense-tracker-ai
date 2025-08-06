import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Expense, ExpenseCategory, ExpenseSummary } from '@/types';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function calculateExpenseSummary(expenses: Expense[]): ExpenseSummary {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const totalSpending = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const monthlyExpenses = expenses.filter(exp => {
    const expenseDate = parseISO(exp.date);
    return isWithinInterval(expenseDate, { start: monthStart, end: monthEnd });
  });
  
  const monthlySpending = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryBreakdown: Record<ExpenseCategory, number> = {
    Food: 0,
    Transportation: 0,
    Entertainment: 0,
    Shopping: 0,
    Bills: 0,
    Other: 0,
  };

  expenses.forEach(exp => {
    categoryBreakdown[exp.category] += exp.amount;
  });

  const topCategory = Object.entries(categoryBreakdown).reduce((top, [category, amount]) => {
    return amount > (categoryBreakdown[top as ExpenseCategory] || 0) ? category : top;
  }, Object.keys(categoryBreakdown)[0]) as ExpenseCategory | null;

  return {
    totalSpending,
    monthlySpending,
    categoryBreakdown,
    topCategory: totalSpending > 0 ? topCategory : null,
    expenseCount: expenses.length,
  };
}

export function exportToCSV(expenses: Expense[]): void {
  const headers = ['Date', 'Category', 'Description', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(exp => [
      format(parseISO(exp.date), 'yyyy-MM-dd'),
      exp.category,
      `"${exp.description}"`,
      exp.amount.toFixed(2)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}