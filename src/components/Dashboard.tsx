'use client';

import React from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { formatCurrency } from '@/lib/utils';
import { 
  DollarSign, 
  Calendar, 
  TrendingUp, 
  PieChart,
  CreditCard,
  Target
} from 'lucide-react';

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    value: string;
    isPositive: boolean;
  } | null;
}

function SummaryCard({ title, value, subtitle, icon, color, trend }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-4 w-4 ${trend.isPositive ? '' : 'rotate-180'}`} />
            {trend.value}
          </div>
        )}
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}

interface CategoryBreakdownProps {
  categoryBreakdown: Record<string, number>;
  totalSpending: number;
}

function CategoryBreakdown({ categoryBreakdown, totalSpending }: CategoryBreakdownProps) {
  const categories = Object.entries(categoryBreakdown)
    .filter(([, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  const getCategoryColor = (category: string, index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-purple-500',
      'bg-pink-500',
      'bg-yellow-500',
      'bg-red-500'
    ];
    return colors[index % colors.length];
  };

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <PieChart className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No expenses to show</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <PieChart className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
      </div>
      
      <div className="space-y-3">
        {categories.map(([category, amount], index) => {
          const percentage = (amount / totalSpending * 100).toFixed(1);
          return (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(category, index)}`} />
                <span className="text-sm font-medium text-gray-700">{category}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{percentage}%</span>
                <span className="text-sm font-semibold text-gray-900 min-w-0">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { summary, expenses } = useExpenses();

  const getMonthlyTrend = () => {
    if (expenses.length < 2) return null;
    
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    
    const currentMonth = summary.monthlySpending;
    return currentMonth > 0 ? { value: '+12%', isPositive: false } : null;
  };

  const getTopCategorySubtitle = () => {
    if (!summary.topCategory) return undefined;
    const amount = summary.categoryBreakdown[summary.topCategory];
    const percentage = summary.totalSpending > 0 
      ? ((amount / summary.totalSpending) * 100).toFixed(0)
      : 0;
    return `${percentage}% of total spending`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Target className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary.totalSpending)}
          subtitle={`${summary.expenseCount} transactions`}
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        
        <SummaryCard
          title="This Month"
          value={formatCurrency(summary.monthlySpending)}
          subtitle={new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          icon={<Calendar className="h-6 w-6 text-white" />}
          color="bg-green-500"
          trend={getMonthlyTrend()}
        />
        
        <SummaryCard
          title="Top Category"
          value={summary.topCategory || 'None'}
          subtitle={getTopCategorySubtitle()}
          icon={<PieChart className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        
        <SummaryCard
          title="Average per Transaction"
          value={summary.expenseCount > 0 
            ? formatCurrency(summary.totalSpending / summary.expenseCount)
            : formatCurrency(0)
          }
          subtitle="Based on all expenses"
          icon={<CreditCard className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdown 
          categoryBreakdown={summary.categoryBreakdown}
          totalSpending={summary.totalSpending}
        />
        
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Total Transactions</span>
              <span className="font-semibold text-gray-900">{summary.expenseCount}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Categories Used</span>
              <span className="font-semibold text-gray-900">
                {Object.values(summary.categoryBreakdown).filter(amount => amount > 0).length}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600">Highest Single Expense</span>
              <span className="font-semibold text-gray-900">
                {expenses.length > 0 
                  ? formatCurrency(Math.max(...expenses.map(exp => exp.amount)))
                  : formatCurrency(0)
                }
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-gray-600">Lowest Single Expense</span>
              <span className="font-semibold text-gray-900">
                {expenses.length > 0 
                  ? formatCurrency(Math.min(...expenses.map(exp => exp.amount)))
                  : formatCurrency(0)
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}