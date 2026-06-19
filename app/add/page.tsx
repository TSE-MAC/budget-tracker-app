'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useBudget } from '@/components/budget-context';

export default function AddExpensePage() {
  const router = useRouter();
  const { data, isLoaded, addExpense } = useBudget();

  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isLoaded || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSubmit = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    if (!categoryId) {
      toast.error('Select a category');
      return;
    }

    addExpense({
      amount: amt,
      categoryId,
      description: description.trim(),
      date,
    });
    toast.success('Expense added!');
    router.push('/');
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <Link
          href="/"
          className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Add Expense</h1>
      </div>

      {/* Amount input */}
      <div className="rounded-3xl bg-card border border-border/50 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Amount</p>
        <div className="flex items-center justify-center gap-1">
          <span className="text-3xl font-bold text-muted-foreground">₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="text-5xl font-extrabold bg-transparent outline-none text-center w-48 placeholder:text-muted-foreground/30"
            autoFocus
          />
        </div>
      </div>

      {/* Category selector */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Category
        </p>
        <div className="grid grid-cols-4 gap-2">
          {data.categories.map((cat) => {
            const isSelected = categoryId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategoryId(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 transition-all active:scale-95 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-transparent bg-card hover:bg-secondary'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[11px] font-medium leading-tight text-center">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Description
          <span className="text-xs font-normal ml-1 normal-case">(optional)</span>
        </p>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Pizza, Uber ride..."
          className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border/50 outline-none focus:border-emerald-500 transition-colors text-sm placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Date */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Date
        </p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full px-4 py-3.5 rounded-2xl bg-card border border-border/50 outline-none focus:border-emerald-500 transition-colors text-sm"
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-transform"
      >
        <Check className="w-5 h-5" />
        Add Expense
      </button>
    </div>
  );
}
