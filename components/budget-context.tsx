'use client';

import React, { createContext, useContext } from 'react';
import { useBudgetStore } from '@/hooks/use-budget-store';

type BudgetStoreType = ReturnType<typeof useBudgetStore>;

const BudgetContext = createContext<BudgetStoreType | null>(null);

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const store = useBudgetStore();
  return <BudgetContext.Provider value={store}>{children}</BudgetContext.Provider>;
}

export function useBudget(): BudgetStoreType {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
}
