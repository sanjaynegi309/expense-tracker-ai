'use client';

import React, { useState } from 'react';
import { useExpenses } from '@/contexts/ExpenseContext';
import { exportToCSV } from '@/lib/utils';
import { Download, FileText, Calendar, Filter } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function ExportOptions() {
  const { expenses, filteredExpenses, filters } = useExpenses();
  const [exportRange, setExportRange] = useState<'all' | 'filtered'>('all');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const expensesToExport = exportRange === 'filtered' ? filteredExpenses : expenses;
      
      if (expensesToExport.length === 0) {
        alert('No expenses to export');
        return;
      }
      
      exportToCSV(expensesToExport);
      
      setTimeout(() => {
        setIsExporting(false);
      }, 1000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
    }
  };

  const getExportSummary = () => {
    const expensesToExport = exportRange === 'filtered' ? filteredExpenses : expenses;
    const totalAmount = expensesToExport.reduce((sum, exp) => sum + exp.amount, 0);
    const dateRange = expensesToExport.length > 0 
      ? {
          earliest: format(parseISO(expensesToExport.sort((a, b) => a.date.localeCompare(b.date))[0].date), 'MMM dd, yyyy'),
          latest: format(parseISO(expensesToExport.sort((a, b) => b.date.localeCompare(a.date))[0].date), 'MMM dd, yyyy')
        }
      : null;

    return { count: expensesToExport.length, totalAmount, dateRange };
  };

  const summary = getExportSummary();
  const hasFilters = filters.searchTerm || filters.category || filters.dateFrom || filters.dateTo;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <Download className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Export Expenses</h3>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-6">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No expenses to export</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="all"
                  checked={exportRange === 'all'}
                  onChange={(e) => setExportRange(e.target.value as 'all' | 'filtered')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Export all expenses ({expenses.length} total)
                </span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  value="filtered"
                  checked={exportRange === 'filtered'}
                  onChange={(e) => setExportRange(e.target.value as 'all' | 'filtered')}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                  disabled={!hasFilters}
                />
                <span className={`text-sm ${hasFilters ? 'text-gray-700' : 'text-gray-400'}`}>
                  Export filtered expenses ({filteredExpenses.length} matching filters)
                </span>
              </label>
            </div>
            
            {!hasFilters && (
              <p className="text-xs text-gray-500 mt-1 ml-5">
                Apply filters to enable filtered export
              </p>
            )}
          </div>

          {hasFilters && exportRange === 'filtered' && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Active Filters</span>
              </div>
              <div className="text-xs text-blue-700 space-y-1">
                {filters.searchTerm && (
                  <div>Search: &quot;{filters.searchTerm}&quot;</div>
                )}
                {filters.category && (
                  <div>Category: {filters.category}</div>
                )}
                {filters.dateFrom && (
                  <div>From: {format(parseISO(filters.dateFrom), 'MMM dd, yyyy')}</div>
                )}
                {filters.dateTo && (
                  <div>To: {format(parseISO(filters.dateTo), 'MMM dd, yyyy')}</div>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Export Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Total expenses:</span>
                <span className="font-medium">{summary.count}</span>
              </div>
              <div className="flex justify-between">
                <span>Total amount:</span>
                <span className="font-medium">
                  ${summary.totalAmount.toFixed(2)}
                </span>
              </div>
              {summary.dateRange && (
                <div className="flex justify-between">
                  <span>Date range:</span>
                  <span className="font-medium">
                    {summary.dateRange.earliest} - {summary.dateRange.latest}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Export Format: CSV</p>
                <p>The exported file will include: Date, Category, Description, and Amount columns. Perfect for importing into Excel or Google Sheets.</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleExport}
            disabled={isExporting || summary.count === 0}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Download CSV'}
          </button>
        </div>
      )}
    </div>
  );
}