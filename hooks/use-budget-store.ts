'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  type AppData,
  type Category,
  type Expense,
} from '@/lib/types';
import {
  loadData,
  saveData,
  generateId,
  getMonthKey,
} from '@/lib/store';

export function useBudgetStore() {
  const [data, setData] = useState<AppData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setData(loadData());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (data && isLoaded) saveData(data);
  }, [data, isLoaded]);

  // ── Categories ──

  const addCategory = useCallback((cat: Omit<Category, 'id'>) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, categories: [...prev.categories, { ...cat, id: generateId() }] };
    });
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Category>) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      };
    });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        categories: prev.categories.filter((c) => c.id !== id),
        expenses: prev.expenses.map((e) =>
          e.categoryId === id ? { ...e, categoryId: 'other' } : e,
        ),
        budgetLimits: prev.budgetLimits.filter((b) => b.categoryId !== id),
      };
    });
  }, []);

  // ── Expenses ──

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setData((prev) => {
      if (!prev) return prev;
      const entry: Expense = {
        ...expense,
        id: generateId(),
        createdAt: new Date().toISOString(),
      };
      return { ...prev, expenses: [entry, ...prev.expenses] };
    });
  }, []);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        expenses: prev.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      };
    });
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, expenses: prev.expenses.filter((e) => e.id !== id) };
    });
  }, []);

  // ── Budget Limits ──

  const setBudgetLimit = useCallback((categoryId: string, amount: number) => {
    setData((prev) => {
      if (!prev) return prev;
      const idx = prev.budgetLimits.findIndex((b) => b.categoryId === categoryId);
      const newLimits = [...prev.budgetLimits];
      if (idx >= 0) {
        newLimits[idx] = { categoryId, amount };
      } else {
        newLimits.push({ categoryId, amount });
      }
      return { ...prev, budgetLimits: newLimits };
    });
  }, []);

  const removeBudgetLimit = useCallback((categoryId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        budgetLimits: prev.budgetLimits.filter((b) => b.categoryId !== categoryId),
      };
    });
  }, []);

  // ── Computed ──

  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);

  const currentMonthExpenses = useMemo(
    () => (data ? data.expenses.filter((e) => getMonthKey(e.date) === currentMonthKey) : []),
    [data, currentMonthKey],
  );

  const currentMonthTotal = useMemo(
    () => currentMonthExpenses.reduce((s, e) => s + e.amount, 0),
    [currentMonthExpenses],
  );

  const allMonthKeys = useMemo(() => {
    if (!data) return [];
    const months = new Set<string>();
    for (const e of data.expenses) months.add(getMonthKey(e.date));
    return Array.from(months).sort((a, b) => b.localeCompare(a));
  }, [data]);

  const getExpensesForMonth = useCallback(
    (monthKey: string) => {
      if (!data) return [];
      return data.expenses
        .filter((e) => getMonthKey(e.date) === monthKey)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    [data],
  );

  const getCategoryTotalForMonth = useCallback(
    (categoryId: string, monthKey: string) => {
      if (!data) return 0;
      return data.expenses
        .filter((e) => e.categoryId === categoryId && getMonthKey(e.date) === monthKey)
        .reduce((s, e) => s + e.amount, 0);
    },
    [data],
  );

  const getCategoryExpensesForMonth = useCallback(
    (categoryId: string, monthKey: string) => {
      if (!data) return [];
      return data.expenses
        .filter((e) => e.categoryId === categoryId && getMonthKey(e.date) === monthKey)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    [data],
  );

  const getBudgetStatus = useCallback(
    (categoryId: string) => {
      if (!data) return null;
      const budget = data.budgetLimits.find((b) => b.categoryId === categoryId);
      if (!budget) return null;
      const spent = currentMonthExpenses
        .filter((e) => e.categoryId === categoryId)
        .reduce((s, e) => s + e.amount, 0);
      const pct = budget.amount > 0 ? Math.round((spent / budget.amount) * 100) : 0;
      return {
        limit: budget.amount,
        spent,
        remaining: budget.amount - spent,
        percentage: pct,
        exceeded: pct >= 100,
        warning: pct >= 80 && pct < 100,
      };
    },
    [data, currentMonthExpenses],
  );

  return {
    data,
    isLoaded,
    addCategory,
    updateCategory,
    deleteCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    setBudgetLimit,
    removeBudgetLimit,
    currentMonthKey,
    currentMonthExpenses,
    currentMonthTotal,
    allMonthKeys,
    getExpensesForMonth,
    getCategoryTotalForMonth,
    getCategoryExpensesForMonth,
    getBudgetStatus,
  };
}
