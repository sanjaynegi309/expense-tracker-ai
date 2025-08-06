'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Expense, ExpenseFilters, ExpenseSummary } from '@/types';
import { storageUtils } from '@/lib/storage';
import { calculateExpenseSummary } from '@/lib/utils';

interface ExpenseState {
  expenses: Expense[];
  filteredExpenses: Expense[];
  filters: ExpenseFilters;
  summary: ExpenseSummary;
  loading: boolean;
  error: string | null;
}

type ExpenseAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_FILTERS'; payload: ExpenseFilters }
  | { type: 'APPLY_FILTERS' };

const initialState: ExpenseState = {
  expenses: [],
  filteredExpenses: [],
  filters: {},
  summary: {
    totalSpending: 0,
    monthlySpending: 0,
    categoryBreakdown: {
      Food: 0,
      Transportation: 0,
      Entertainment: 0,
      Shopping: 0,
      Bills: 0,
      Other: 0,
    },
    topCategory: null,
    expenseCount: 0,
  },
  loading: false,
  error: null,
};

function applyFilters(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter(expense => {
    if (filters.category && filters.category !== 'all' && expense.category !== filters.category) {
      return false;
    }
    
    if (filters.dateFrom && expense.date < filters.dateFrom) {
      return false;
    }
    
    if (filters.dateTo && expense.date > filters.dateTo) {
      return false;
    }
    
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return expense.description.toLowerCase().includes(searchLower) ||
             expense.category.toLowerCase().includes(searchLower);
    }
    
    return true;
  });
}

function expenseReducer(state: ExpenseState, action: ExpenseAction): ExpenseState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'LOAD_EXPENSES': {
      const expenses = action.payload;
      const filteredExpenses = applyFilters(expenses, state.filters);
      const summary = calculateExpenseSummary(expenses);
      return { ...state, expenses, filteredExpenses, summary };
    }
    
    case 'ADD_EXPENSE': {
      const expenses = [...state.expenses, action.payload];
      const filteredExpenses = applyFilters(expenses, state.filters);
      const summary = calculateExpenseSummary(expenses);
      return { ...state, expenses, filteredExpenses, summary };
    }
    
    case 'UPDATE_EXPENSE': {
      const expenses = state.expenses.map(exp => 
        exp.id === action.payload.id ? action.payload : exp
      );
      const filteredExpenses = applyFilters(expenses, state.filters);
      const summary = calculateExpenseSummary(expenses);
      return { ...state, expenses, filteredExpenses, summary };
    }
    
    case 'DELETE_EXPENSE': {
      const expenses = state.expenses.filter(exp => exp.id !== action.payload);
      const filteredExpenses = applyFilters(expenses, state.filters);
      const summary = calculateExpenseSummary(expenses);
      return { ...state, expenses, filteredExpenses, summary };
    }
    
    case 'SET_FILTERS': {
      const filters = { ...state.filters, ...action.payload };
      const filteredExpenses = applyFilters(state.expenses, filters);
      return { ...state, filters, filteredExpenses };
    }
    
    case 'APPLY_FILTERS': {
      const filteredExpenses = applyFilters(state.expenses, state.filters);
      return { ...state, filteredExpenses };
    }
    
    default:
      return state;
  }
}

interface ExpenseContextType extends ExpenseState {
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (expense: Expense) => void;
  deleteExpense: (id: string) => void;
  setFilters: (filters: ExpenseFilters) => void;
  clearFilters: () => void;
  refreshExpenses: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const expenses = storageUtils.getExpenses();
      dispatch({ type: 'LOAD_EXPENSES', payload: expenses });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load expenses' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      createdAt: now,
      updatedAt: now,
    };

    try {
      storageUtils.addExpense(expense);
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add expense' });
    }
  };

  const updateExpense = (expense: Expense) => {
    const updatedExpense = { ...expense, updatedAt: new Date().toISOString() };
    
    try {
      storageUtils.updateExpense(updatedExpense);
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update expense' });
    }
  };

  const deleteExpense = (id: string) => {
    try {
      storageUtils.deleteExpense(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete expense' });
    }
  };

  const setFilters = (filters: ExpenseFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: 'SET_FILTERS', payload: {} });
  };

  const refreshExpenses = () => {
    try {
      const expenses = storageUtils.getExpenses();
      dispatch({ type: 'LOAD_EXPENSES', payload: expenses });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh expenses' });
    }
  };

  const contextValue: ExpenseContextType = {
    ...state,
    addExpense,
    updateExpense,
    deleteExpense,
    setFilters,
    clearFilters,
    refreshExpenses,
  };

  return (
    <ExpenseContext.Provider value={contextValue}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}