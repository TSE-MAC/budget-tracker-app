'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet, ChevronRight, AlertTriangle } from 'lucide-react';
import { useBudget } from '@/components/budget-context';
import { formatCurrency, getMonthLabel } from '@/lib/store';

export default function HomePage() {
  const {
    data,
    isLoaded,
    currentMonthKey,
    currentMonthTotal,
    currentMonthExpenses,
    getBudgetStatus,
  } = useBudget();

  if (!isLoaded || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Build category totals for current month
  const categoryTotals = data.categories
    .map((cat) => {
      const total = currentMonthExpenses
        .filter((e) => e.categoryId === cat.id)
        .reduce((s, e) => s + e.amount, 0);
      return { ...cat, total };
    })
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="animate-fade-in-up flex items-center gap-3 pt-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Wallet className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold">BudgetPro</h1>
          <p className="text-xs text-muted-foreground">
            {getMonthLabel(currentMonthKey)}
          </p>
        </div>
      </div>

      {/* Total card */}
      <div className="animate-fade-in-up stagger-1 rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 text-white shadow-xl shadow-emerald-500/20">
        <p className="text-sm font-medium text-emerald-100">This Month</p>
        <p className="text-4xl font-extrabold mt-2 tracking-tight">
          {formatCurrency(currentMonthTotal)}
        </p>
        <p className="text-sm text-emerald-200 mt-2">
          Total Expenses •{' '}
          {currentMonthExpenses.length}{' '}
          {currentMonthExpenses.length === 1 ? 'transaction' : 'transactions'}
        </p>
      </div>

      {/* Budget warnings */}
      {data.categories.map((cat) => {
        const status = getBudgetStatus(cat.id);
        if (!status || !status.exceeded) return null;
        return (
          <div
            key={cat.id}
            className="animate-fade-in-up flex items-center gap-3 p-3 rounded-2xl bg-red-500/10 border border-red-500/20"
          >
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">
              <strong>{cat.name}</strong> budget exceeded!{' '}
              {formatCurrency(status.spent)} / {formatCurrency(status.limit)}
            </p>
          </div>
        );
      })}

      {/* Category cards */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider animate-fade-in-up stagger-2">
          By Category
        </h2>

        {categoryTotals.length > 0 ? (
          categoryTotals.map((cat, i) => {
            const budgetStatus = getBudgetStatus(cat.id);
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}?month=${currentMonthKey}`}
                className={`animate-fade-in-up stagger-${Math.min(i + 3, 7)} flex items-center gap-4 p-4 rounded-2xl bg-card border border-border/50 active:scale-[0.98] transition-transform`}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${cat.color}18` }}
                >
                  {cat.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{cat.name}</span>
                    <span className="font-bold">{formatCurrency(cat.total)}</span>
                  </div>
                  {budgetStatus && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>
                          {formatCurrency(budgetStatus.spent)} / {formatCurrency(budgetStatus.limit)}
                        </span>
                        <span
                          className={
                            budgetStatus.exceeded
                              ? 'text-red-500 font-semibold'
                              : budgetStatus.warning
                              ? 'text-amber-500 font-medium'
                              : ''
                          }
                        >
                          {budgetStatus.percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            budgetStatus.exceeded
                              ? 'bg-red-500'
                              : budgetStatus.warning
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, budgetStatus.percentage)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </Link>
            );
          })
        ) : (
          <div className="animate-fade-in-up text-center py-12 rounded-2xl bg-card border border-border/50">
            <p className="text-4xl mb-3">💰</p>
            <p className="text-muted-foreground text-sm">No expenses this month</p>
            <Link
              href="/add"
              className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium active:scale-95 transition-transform"
            >
              Add your first expense
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
