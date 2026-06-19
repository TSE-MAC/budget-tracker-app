'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun, Target, Trash2, Check, X, AlertTriangle, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useBudget } from '@/components/budget-context';
import { formatCurrency } from '@/lib/store';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const {
    data,
    isLoaded,
    setBudgetLimit,
    removeBudgetLimit,
    getBudgetStatus,
    currentMonthTotal,
  } = useBudget();

  const [showBudgetForm, setShowBudgetForm] = useState(false);
  const [budgetCatId, setBudgetCatId] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');

  useEffect(() => setMounted(true), []);

  if (!isLoaded || !data || !mounted) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSetBudget = () => {
    const amt = parseFloat(budgetAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (!budgetCatId) {
      toast.error('Select a category');
      return;
    }
    setBudgetLimit(budgetCatId, amt);
    toast.success('Budget limit set');
    setShowBudgetForm(false);
    setBudgetCatId('');
    setBudgetAmount('');
  };

  const handleClearData = () => {
    if (window.confirm('This will delete ALL your data permanently. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // Categories with active budgets
  const budgetedCategories = data.categories
    .map((cat) => {
      const status = getBudgetStatus(cat.id);
      const budget = data.budgetLimits.find((b) => b.categoryId === cat.id);
      return { ...cat, status, budget };
    })
    .filter((c) => c.budget);

  const unbugdetedCategories = data.categories.filter(
    (cat) => !data.budgetLimits.find((b) => b.categoryId === cat.id),
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pt-2 animate-fade-in-up">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Preferences & budget limits</p>
      </div>

      {/* Theme toggle */}
      <div className="animate-fade-in-up stagger-1 rounded-3xl bg-card border border-border/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === 'dark' ? (
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
                <Moon className="w-5 h-5 text-indigo-400" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>
            )}
            <div>
              <p className="font-semibold text-sm">Dark Mode</p>
              <p className="text-xs text-muted-foreground">
                {theme === 'dark' ? 'Currently on' : 'Currently off'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
              theme === 'dark' ? 'bg-emerald-500' : 'bg-secondary'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                theme === 'dark' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Budget Limits */}
      <div className="animate-fade-in-up stagger-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-500" />
            <h2 className="font-bold">Budget Limits</h2>
          </div>
          <button
            onClick={() => setShowBudgetForm(!showBudgetForm)}
            className="text-xs font-semibold text-emerald-500 px-3 py-1.5 rounded-xl bg-emerald-500/10 active:scale-95 transition-transform"
          >
            {showBudgetForm ? 'Cancel' : '+ Set Budget'}
          </button>
        </div>

        {/* Set budget form */}
        {showBudgetForm && (
          <div className="animate-scale-in rounded-3xl bg-card border border-border/50 p-4 space-y-3">
            <select
              value={budgetCatId}
              onChange={(e) => setBudgetCatId(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border text-sm outline-none focus:border-emerald-500"
            >
              <option value="">Select category</option>
              {data.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={budgetAmount}
              onChange={(e) => setBudgetAmount(e.target.value)}
              placeholder="Budget amount (₹)"
              className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border text-sm outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSetBudget}
              className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Check className="w-4 h-4" /> Set Budget
            </button>
          </div>
        )}

        {/* Active budgets */}
        {budgetedCategories.length > 0 ? (
          <div className="space-y-2">
            {budgetedCategories.map((cat) => {
              const status = cat.status!;
              return (
                <div
                  key={cat.id}
                  className={`rounded-3xl bg-card border p-4 ${
                    status.exceeded
                      ? 'border-red-500/30'
                      : status.warning
                      ? 'border-amber-500/30'
                      : 'border-border/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-semibold text-sm">{cat.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        removeBudgetLimit(cat.id);
                        toast.success('Budget removed');
                      }}
                      className="p-2 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">
                      {formatCurrency(status.spent)} / {formatCurrency(status.limit)}
                    </span>
                    <span
                      className={`font-semibold ${
                        status.exceeded
                          ? 'text-red-500'
                          : status.warning
                          ? 'text-amber-500'
                          : 'text-emerald-500'
                      }`}
                    >
                      {status.exceeded
                        ? 'Budget Exceeded'
                        : status.warning
                        ? `${status.percentage}% used`
                        : `${status.percentage}% used`}
                    </span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        status.exceeded
                          ? 'bg-red-500'
                          : status.warning
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, status.percentage)}%` }}
                    />
                  </div>
                  {status.exceeded && (
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Over by {formatCurrency(Math.abs(status.remaining))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-3xl bg-card border border-border/50 p-6 text-center">
            <Target className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">No budget limits set</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Set limits to track your spending
            </p>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="animate-fade-in-up stagger-3 rounded-3xl bg-card border border-red-500/20 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">Clear All Data</p>
            <p className="text-xs text-muted-foreground">Permanently delete everything</p>
          </div>
          <button
            onClick={handleClearData}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold active:scale-95 transition-transform"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
