'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Calendar, DollarSign, Tag } from 'lucide-react';
import ExpenseForm from './ExpenseForm';

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const getCategoryColor = (category: string) => {
    const colors = {
      Food: 'bg-green-100 text-green-800',
      Transportation: 'bg-blue-100 text-blue-800',
      Entertainment: 'bg-purple-100 text-purple-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Bills: 'bg-red-100 text-red-800',
      Other: 'bg-gray-100 text-gray-800',
    };
    return colors[category as keyof typeof colors] || colors.Other;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(expense.category)}`}>
              <Tag className="h-3 w-3 mr-1" />
              {expense.category}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {format(parseISO(expense.date), 'MMM dd, yyyy')}
            </div>
          </div>
          
          <p className="text-gray-900 font-medium truncate mb-1">
            {expense.description}
          </p>
          
          <div className="flex items-center text-lg font-bold text-gray-900">
            <DollarSign className="h-4 w-4 mr-1" />
            {formatCurrency(expense.amount)}
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={() => onEdit(expense)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit expense"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete expense"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ExpenseList() {
  const { filteredExpenses, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteExpense(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleEditSuccess = () => {
    setEditingExpense(null);
  };

  const handleEditCancel = () => {
    setEditingExpense(null);
  };

  if (editingExpense) {
    return (
      <div className="space-y-6">
        <ExpenseForm
          expense={editingExpense}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      </div>
    );
  }

  if (filteredExpenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
        <div className="text-gray-400 mb-2">
          <DollarSign className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-1">No expenses found</h3>
        <p className="text-gray-500">
          Add your first expense to get started tracking your spending.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          Recent Expenses ({filteredExpenses.length})
        </h2>
      </div>
      
      <div className="space-y-3">
        {filteredExpenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this expense? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}