import React, { useState } from 'react';
import Card from './Card';
import Button from './Button';
import { Plus, Trash2, Calendar, DollarSign, Tag } from 'lucide-react';

const BudgetTracker = ({ 
  subscriptions, 
  expenses, 
  onAddSubscription, 
  onRemoveSubscription, 
  onAddExpense 
}) => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cost: '',
    frequency: 'monthly',
    category: 'entertainment'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'subscriptions') {
      onAddSubscription({
        name: formData.name,
        cost: formData.cost,
        frequency: formData.frequency
      });
    } else {
      onAddExpense({
        amount: formData.cost,
        category: formData.category,
        description: formData.name
      });
    }
    setFormData({ name: '', cost: '', frequency: 'monthly', category: 'entertainment' });
    setShowAddForm(false);
  };

  const getTodayExpenses = () => {
    const today = new Date().toDateString();
    return expenses.filter(expense => 
      new Date(expense.timestamp).toDateString() === today
    );
  };

  const getMonthlyTotal = () => {
    return subscriptions.reduce((total, sub) => {
      if (sub.frequency === 'monthly') return total + parseFloat(sub.cost);
      if (sub.frequency === 'yearly') return total + (parseFloat(sub.cost) / 12);
      return total;
    }, 0);
  };

  const todayExpenses = getTodayExpenses();
  const todayTotal = todayExpenses.reduce((total, expense) => 
    total + parseFloat(expense.amount), 0
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-white mb-2">Budget Tracker</h2>
        <p className="text-purple-200 text-sm">
          Manage your subscriptions and daily expenses
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-purple-400 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Monthly Subscriptions</p>
              <p className="text-2xl font-bold">${getMonthlyTotal().toFixed(2)}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Today's Expenses</p>
              <p className="text-2xl font-bold">${todayTotal.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-200" />
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-white/10 backdrop-blur-sm rounded-lg p-1">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'subscriptions'
              ? 'bg-white text-purple-600 shadow-lg'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          Subscriptions
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'expenses'
              ? 'bg-white text-purple-600 shadow-lg'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          Daily Expenses
        </button>
      </div>

      {/* Add Button */}
      <Button
        variant="primary"
        onClick={() => setShowAddForm(true)}
        className="w-full"
      >
        <Plus size={16} />
        Add {activeTab === 'subscriptions' ? 'Subscription' : 'Expense'}
      </Button>

      {/* Add Form */}
      {showAddForm && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {activeTab === 'subscriptions' ? 'Service Name' : 'Description'}
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={activeTab === 'subscriptions' ? 'Netflix, Spotify...' : 'Coffee, Lunch...'}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                {activeTab === 'subscriptions' ? 'Monthly Cost' : 'Amount'}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
                required
              />
            </div>

            {activeTab === 'subscriptions' ? (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="food">Food</option>
                  <option value="transportation">Transportation</option>
                  <option value="entertainment">Entertainment</option>
                  <option value="shopping">Shopping</option>
                  <option value="utilities">Utilities</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="submit" variant="primary" className="flex-1">
                Add {activeTab === 'subscriptions' ? 'Subscription' : 'Expense'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowAddForm(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Content List */}
      <div className="space-y-3">
        {activeTab === 'subscriptions' ? (
          subscriptions.length > 0 ? (
            subscriptions.map((subscription) => (
              <Card key={subscription.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{subscription.name}</h4>
                    <p className="text-sm text-text-secondary">
                      ${subscription.cost} / {subscription.frequency}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => onRemoveSubscription(subscription.id)}
                  className="p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </Card>
            ))
          ) : (
            <Card className="text-center py-8">
              <Calendar className="h-12 w-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No subscriptions added yet</p>
            </Card>
          )
        ) : (
          todayExpenses.length > 0 ? (
            todayExpenses.map((expense) => (
              <Card key={expense.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Tag className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{expense.description}</h4>
                    <p className="text-sm text-text-secondary">
                      {expense.category} • {new Date(expense.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-text-primary">${expense.amount}</p>
                </div>
              </Card>
            ))
          ) : (
            <Card className="text-center py-8">
              <DollarSign className="h-12 w-12 text-text-secondary mx-auto mb-3" />
              <p className="text-text-secondary">No expenses for today</p>
            </Card>
          )
        )}
      </div>
    </div>
  );
};

export default BudgetTracker;