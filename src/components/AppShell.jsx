import React from 'react';
import { Home, Scale, DollarSign } from 'lucide-react';
import AuthButton from './AuthButton';

const AppShell = ({ children, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'legal', label: 'Legal', icon: Scale },
    { id: 'budget', label: 'Budget', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <header className="pt-8 pb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-white">
                Pocket Legal
              </h1>
            </div>
            <div className="flex-1 flex justify-end">
              <AuthButton />
            </div>
          </div>
          <p className="text-purple-200 text-center text-sm">
            Your rights and budget, at your fingertips
          </p>
        </header>

        {/* Navigation */}
        <nav className="mb-6">
          <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-purple-600 shadow-lg'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Content */}
        <main className="pb-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
