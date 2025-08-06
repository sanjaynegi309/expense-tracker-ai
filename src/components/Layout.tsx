'use client';

import React, { useState } from 'react';
import Navigation from './Navigation';
import Dashboard from './Dashboard';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import ExpenseFilters from './ExpenseFilters';
import ExpenseCharts from './ExpenseCharts';
import ExportOptions from './ExportOptions';
import { ExpenseProvider } from '@/contexts/ExpenseContext';

export default function Layout() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'add':
        return (
          <div className="max-w-2xl">
            <ExpenseForm />
          </div>
        );
      case 'expenses':
        return (
          <div className="space-y-6">
            <ExpenseFilters />
            <ExpenseList />
          </div>
        );
      case 'charts':
        return <ExpenseCharts />;
      case 'export':
        return (
          <div className="max-w-2xl">
            <ExportOptions />
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <ExpenseProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </ExpenseProvider>
  );
}