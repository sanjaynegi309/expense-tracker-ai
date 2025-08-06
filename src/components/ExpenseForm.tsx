'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { ExpenseFormData, EXPENSE_CATEGORIES, Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Plus, DollarSign, Calendar, Tag, FileText } from 'lucide-react';

interface ExpenseFormProps {
  expense?: Expense;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ExpenseForm({ expense, onSuccess, onCancel }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: expense ? expense.amount.toString() : '',
    category: expense ? expense.category : 'Food',
    description: expense ? expense.description : '',
    date: expense ? expense.date : new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Partial<ExpenseFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<ExpenseFormData> = {};

    if (!formData.amount || isNaN(Number(formData.amount))) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (Number(formData.amount) > 999999) {
      newErrors.amount = 'Amount cannot exceed $999,999';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 3) {
      newErrors.description = 'Description must be at least 3 characters';
    } else if (formData.description.trim().length > 100) {
      newErrors.description = 'Description cannot exceed 100 characters';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    } else if (new Date(formData.date) > new Date()) {
      newErrors.date = 'Date cannot be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        category: formData.category,
        description: formData.description.trim(),
        date: formData.date,
      };

      if (expense) {
        updateExpense({
          ...expense,
          ...expenseData,
        });
      } else {
        addExpense(expenseData);
      }

      if (!expense) {
        setFormData({
          amount: '',
          category: 'Food',
          description: '',
          date: new Date().toISOString().split('T')[0],
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error saving expense:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ExpenseFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const isEditing = !!expense;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Plus className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <DollarSign className="h-4 w-4" />
            Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
          {formData.amount && !errors.amount && (
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(parseFloat(formData.amount) || 0)}
            </p>
          )}
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Tag className="h-4 w-4" />
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {EXPENSE_CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <FileText className="h-4 w-4" />
            Description
          </label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="What did you spend on?"
            maxLength={100}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/100 characters
          </p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Calendar className="h-4 w-4" />
            Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Expense' : 'Add Expense'}
          </button>
          {isEditing && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}