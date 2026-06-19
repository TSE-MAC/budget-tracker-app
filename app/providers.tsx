'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { BudgetProvider } from '@/components/budget-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <BudgetProvider>{children}</BudgetProvider>
    </ThemeProvider>
  );
}
