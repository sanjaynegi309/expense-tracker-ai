'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO, startOfWeek, startOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { BarChart3 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280'];

export default function ExpenseCharts() {
  const { expenses, summary } = useExpenses();
  const [chartType, setChartType] = useState<'category' | 'trend' | 'daily'>('category');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const getCategoryData = () => {
    return Object.entries(summary.categoryBreakdown)
      .filter(([, amount]) => amount > 0)
      .map(([category, amount]) => ({
        name: category,
        value: amount,
        percentage: ((amount / summary.totalSpending) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getTrendData = () => {
    if (expenses.length === 0) return [];

    const now = new Date();
    let intervals: Date[] = [];
    let formatStr = '';

    switch (timeRange) {
      case 'week':
        const weekStart = startOfWeek(now);
        intervals = eachDayOfInterval({ 
          start: weekStart, 
          end: now 
        });
        formatStr = 'EEE';
        break;
      case 'month':
        const monthStart = startOfMonth(now);
        intervals = eachDayOfInterval({ 
          start: monthStart, 
          end: now 
        });
        formatStr = 'MMM dd';
        break;
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        intervals = eachMonthOfInterval({ 
          start: yearStart, 
          end: now 
        });
        formatStr = 'MMM yyyy';
        break;
    }

    return intervals.map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayExpenses = expenses.filter(exp => {
        if (timeRange === 'year') {
          return format(parseISO(exp.date), 'yyyy-MM') === format(date, 'yyyy-MM');
        }
        return exp.date === dateStr;
      });
      
      const total = dayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      return {
        date: format(date, formatStr),
        amount: total,
        count: dayExpenses.length
      };
    });
  };

  const getDailyAverageData = () => {
    const last30Days = expenses.filter(exp => {
      const expenseDate = parseISO(exp.date);
      const daysDiff = Math.floor((Date.now() - expenseDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });

    const dailyTotals = last30Days.reduce((acc, exp) => {
      const day = format(parseISO(exp.date), 'yyyy-MM-dd');
      acc[day] = (acc[day] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({
        date: format(parseISO(date), 'MMM dd'),
        amount
      }))
      .sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime())
      .slice(-14);
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; value: number; dataKey: string }>; label?: string }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
        <p className="font-medium text-gray-900">{label}</p>
        {payload.map((entry: { color: string; value: number; dataKey: string }, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.dataKey === 'amount' ? formatCurrency(entry.value) : `${entry.value} expenses`}
          </p>
        ))}
      </div>
    );
  };

  const categoryData = getCategoryData();
  const trendData = getTrendData();
  const dailyData = getDailyAverageData();

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="text-center py-8">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">Add some expenses to see visual insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Expense Analytics</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as 'category' | 'trend' | 'daily')}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="category">By Category</option>
              <option value="trend">Spending Trend</option>
              <option value="daily">Daily Overview</option>
            </select>
            
            {(chartType === 'trend' || chartType === 'daily') && (
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as 'week' | 'month' | 'year')}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'category' ? (
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name} (${entry.percentage}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
              </PieChart>
            ) : chartType === 'trend' ? (
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            ) : (
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {chartType === 'category' && categoryData.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
            {categoryData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-gray-700">{item.name}</span>
                <span className="text-gray-500">({item.percentage}%)</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}