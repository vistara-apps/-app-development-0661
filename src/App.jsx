import React, { useState, useEffect } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AppShell from './components/AppShell';
import Dashboard from './components/Dashboard';
import LegalGuides from './components/LegalGuides';
import BudgetTracker from './components/BudgetTracker';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscriptions, setSubscriptions] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // Load data from localStorage on app start
  useEffect(() => {
    const savedSubscriptions = localStorage.getItem('subscriptions');
    const savedExpenses = localStorage.getItem('expenses');
    
    if (savedSubscriptions) {
      setSubscriptions(JSON.parse(savedSubscriptions));
    }
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addSubscription = (subscription) => {
    const newSubscription = {
      ...subscription,
      id: Date.now().toString(),
      startDate: new Date().toISOString()
    };
    setSubscriptions(prev => [...prev, newSubscription]);
  };

  const removeSubscription = (id) => {
    setSubscriptions(prev => prev.filter(sub => sub.id !== id));
  };

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard subscriptions={subscriptions} expenses={expenses} />;
      case 'legal':
        return <LegalGuides />;
      case 'budget':
        return (
          <BudgetTracker
            subscriptions={subscriptions}
            expenses={expenses}
            onAddSubscription={addSubscription}
            onRemoveSubscription={removeSubscription}
            onAddExpense={addExpense}
          />
        );
      default:
        return <Dashboard subscriptions={subscriptions} expenses={expenses} />;
    }
  };

  return (
    <AuthProvider>
      <AppShell activeTab={activeTab} onTabChange={setActiveTab}>
        {renderContent()}
      </AppShell>
    </AuthProvider>
  );
}

export default App;
