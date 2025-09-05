import React from 'react';
import Card from './Card';
import { Shield, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const Dashboard = ({ subscriptions, expenses }) => {
  // Calculate totals
  const monthlySubscriptionTotal = subscriptions.reduce((total, sub) => {
    if (sub.frequency === 'monthly') return total + parseFloat(sub.cost);
    if (sub.frequency === 'yearly') return total + (parseFloat(sub.cost) / 12);
    return total;
  }, 0);

  // Get today's expenses
  const today = new Date().toDateString();
  const todayExpenses = expenses.filter(expense => 
    new Date(expense.timestamp).toDateString() === today
  );
  const todayTotal = todayExpenses.reduce((total, expense) => 
    total + parseFloat(expense.amount), 0
  );

  // Get last 7 days expenses for chart
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayExpenses = expenses.filter(expense => 
      new Date(expense.timestamp).toDateString() === date.toDateString()
    );
    const dayTotal = dayExpenses.reduce((total, expense) => 
      total + parseFloat(expense.amount), 0
    );
    last7Days.push({
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      amount: dayTotal
    });
  }

  // Subscription breakdown for pie chart
  const subscriptionData = subscriptions.map(sub => ({
    name: sub.name,
    value: parseFloat(sub.cost),
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-r from-green-400 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Monthly Subscriptions</p>
              <p className="text-2xl font-bold">${monthlySubscriptionTotal.toFixed(2)}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-200" />
          </div>
        </Card>

        <Card className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Today's Spending</p>
              <p className="text-2xl font-bold">${todayTotal.toFixed(2)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </Card>
      </div>

      {/* Weekly Spending Chart */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp size={20} />
          Weekly Spending
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <XAxis dataKey="day" />
              <YAxis />
              <Bar dataKey="amount" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Subscription Breakdown */}
      {subscriptions.length > 0 && (
        <Card>
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Subscription Breakdown
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subscriptionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {subscriptionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {subscriptionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-text-primary">{item.name}</span>
                </div>
                <span className="text-sm font-medium">${item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border-2 border-accent/20 hover:border-accent/40 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">Know Your Rights</h4>
              <p className="text-sm text-text-secondary">Quick legal guides</p>
            </div>
          </div>
        </Card>

        <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-text-primary">Track Spending</h4>
              <p className="text-sm text-text-secondary">Manage your budget</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;