'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useBudget } from '@/components/budget-context';
import { formatCurrency, getMonthLabel, getMonthKey } from '@/lib/store';

export default function HistoryPage() {
  const { data, isLoaded, allMonthKeys, getExpensesForMonth } = useBudget();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  if (!isLoaded || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="pt-2 animate-fade-in-up">
        <h1 className="text-xl font-bold">History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Monthly expense history</p>
      </div>

      {/* Month list */}
      {allMonthKeys.length > 0 ? (
        <div className="space-y-3">
          {allMonthKeys.map((mk, i) => {
            const monthExpenses = getExpensesForMonth(mk);
            const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0);
            const isExpanded = expandedMonth === mk;

            // Build category breakdown for this month
            const catBreakdown = data.categories
              .map((cat) => {
                const catExpenses = monthExpenses.filter((e) => e.categoryId === cat.id);
                const catTotal = catExpenses.reduce((s, e) => s + e.amount, 0);
                return { ...cat, total: catTotal, count: catExpenses.length };
              })
              .filter((c) => c.total > 0)
              .sort((a, b) => b.total - a.total);

            return (
              <div
                key={mk}
                className={`animate-fade-in-up stagger-${Math.min(i + 1, 7)} rounded-3xl bg-card border border-border/50 overflow-hidden`}
              >
                {/* Month header */}
                <button
                  onClick={() => setExpandedMonth(isExpanded ? null : mk)}
                  className="w-full flex items-center justify-between p-4 active:bg-secondary/30 transition-colors"
                >
                  <div>
                    <p className="font-bold text-base">{getMonthLabel(mk)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {monthExpenses.length} transactions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">{formatCurrency(monthTotal)}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Expanded — category breakdown */}
                {isExpanded && (
                  <div className="border-t border-border/50 bg-secondary/20 p-3 space-y-1.5 animate-fade-in-up">
                    {catBreakdown.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.id}?month=${mk}`}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-card/60 active:scale-[0.98] transition-all"
                      >
                        <span className="text-xl">{cat.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{cat.name}</span>
                            <span className="text-sm font-bold">{formatCurrency(cat.total)}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {cat.count} {cat.count === 1 ? 'transaction' : 'transactions'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl bg-card border border-border/50">
          <p className="text-4xl mb-3">📅</p>
          <p className="text-muted-foreground text-sm">No expense history yet</p>
          <Link
            href="/add"
            className="inline-block mt-3 px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium active:scale-95 transition-transform"
          >
            Add your first expense
          </Link>
        </div>
      )}
    </div>
  );
}
