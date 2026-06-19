// ── Core types ───────────────────────────────

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  description: string;
  date: string; // ISO date "YYYY-MM-DD"
  createdAt: string;
}

export interface BudgetLimit {
  categoryId: string;
  amount: number;
}

export interface AppData {
  categories: Category[];
  expenses: Expense[];
  budgetLimits: BudgetLimit[];
}

// ── Defaults ─────────────────────────────────

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'food', name: 'Food', icon: '🍔', color: '#f97316' },
  { id: 'transport', name: 'Transport', icon: '🚗', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#a855f7' },
  { id: 'bills', name: 'Bills', icon: '📄', color: '#ef4444' },
  { id: 'health', name: 'Health', icon: '💊', color: '#22c55e' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮', color: '#ec4899' },
  { id: 'other', name: 'Other', icon: '📦', color: '#64748b' },
];
