'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useBudget } from '@/components/budget-context';
import { formatCurrency, formatDateFull, getMonthKey, getMonthLabel } from '@/lib/store';

export default function CategoryDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const categoryId = params.id as string;
  const monthParam = searchParams.get('month');
  const currentMonthKey = useMemo(() => getMonthKey(new Date()), []);
  const monthKey = monthParam || currentMonthKey;

  const { data, isLoaded, updateExpense, deleteExpense, getBudgetStatus } = useBudget();

  const [editId, setEditId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editDate, setEditDate] = useState('');

  if (!isLoaded || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const category = data.categories.find((c) => c.id === categoryId);
  if (!category) {
    return (
      <div className="space-y-4 pt-2">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <p className="text-center text-muted-foreground py-12">Category not found</p>
      </div>
    );
  }

  const expenses = data.expenses
    .filter((e) => e.categoryId === categoryId && getMonthKey(e.date) === monthKey)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetStatus = getBudgetStatus(categoryId);

  const startEdit = (exp: typeof expenses[0]) => {
    setEditId(exp.id);
    setEditAmount(String(exp.amount));
    setEditDesc(exp.description);
    setEditDate(exp.date);
  };

  const saveEdit = () => {
    if (!editId) return;
    const amt = parseFloat(editAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    updateExpense(editId, {
      amount: amt,
      description: editDesc.trim(),
      date: editDate,
    });
    toast.success('Expense updated');
    setEditId(null);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    toast.success('Expense deleted');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2 animate-fade-in-up">
        <Link
          href={monthParam ? '/history' : '/'}
          className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h1 className="text-xl font-bold">{category.name}</h1>
            <p className="text-xs text-muted-foreground">{getMonthLabel(monthKey)}</p>
          </div>
        </div>
      </div>

      {/* Total card */}
      <div
        className="animate-fade-in-up stagger-1 rounded-3xl p-5"
        style={{ backgroundColor: `${category.color}12` }}
      >
        <p className="text-sm text-muted-foreground">Total Spent</p>
        <p className="text-3xl font-extrabold mt-1" style={{ color: category.color }}>
          {formatCurrency(total)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'}
        </p>

        {/* Budget progress */}
        {budgetStatus && monthKey === currentMonthKey && (
          <div className="mt-3 pt-3 border-t border-border/30">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">
                Budget: {formatCurrency(budgetStatus.limit)}
              </span>
              <span
                className={
                  budgetStatus.exceeded
                    ? 'text-red-500 font-semibold'
                    : budgetStatus.warning
                    ? 'text-amber-500 font-medium'
                    : 'text-emerald-500'
                }
              >
                {budgetStatus.exceeded ? 'Exceeded!' : `${budgetStatus.percentage}%`}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
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

      {/* Expense list */}
      <div className="space-y-2">
        {expenses.length > 0 ? (
          expenses.map((exp, i) => (
            <div key={exp.id}>
              {editId === exp.id ? (
                /* Edit mode */
                <div className="animate-scale-in rounded-2xl bg-card border border-emerald-500/30 p-4 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={editAmount}
                      onChange={(e) => setEditAmount(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm outline-none focus:border-emerald-500"
                      placeholder="Amount"
                    />
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm outline-none focus:border-emerald-500"
                    />
                  </div>
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary/50 border border-border text-sm outline-none focus:border-emerald-500"
                    placeholder="Description"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditId(null)}
                      className="flex-1 py-2.5 rounded-xl bg-secondary text-sm font-medium active:scale-95 transition-transform"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveEdit}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium flex items-center justify-center gap-1 active:scale-95 transition-transform"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                /* View mode */
                <div
                  className={`animate-fade-in-up stagger-${Math.min(i + 1, 7)} flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">
                        {exp.description || category.name}
                      </span>
                      <span className="font-bold text-sm ml-2">
                        {formatCurrency(exp.amount)}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateFull(exp.date)}
                    </p>
                  </div>
                  <button
                    onClick={() => startEdit(exp)}
                    className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all"
                  >
                    <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="p-2 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 rounded-2xl bg-card border border-border/50">
            <p className="text-4xl mb-3">{category.icon}</p>
            <p className="text-sm text-muted-foreground">No expenses in this category</p>
          </div>
        )}
      </div>
    </div>
  );
}
