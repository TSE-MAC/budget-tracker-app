'use client';

import { useEffect, useState } from 'react';
import Calculator from '@/components/calculator';
import TransactionHistory from '@/components/transaction-history';
import Summary from '@/components/summary';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  note: string;
  date: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budgetTransactions');
    if (savedTransactions) {
      try {
        setTransactions(JSON.parse(savedTransactions));
      } catch (error) {
        console.error('Failed to load transactions:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('budgetTransactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

const addTransaction = (
    type: 'income' | 'expense',
    amount: number,
    note: string,
    date?: Date,
  ) => {
    const newTransaction: Transaction = {
      id: Date.now(),
      type,
      amount,
      note,
      date: (date ?? new Date()).toLocaleDateString(),
    };
    setTransactions([newTransaction, ...transactions]);
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const clearAllTransactions = () => {
    if (window.confirm('Are you sure you want to delete all transactions?')) {
      setTransactions([]);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-slate-50 py-8 px-4 sm:py-12 sm:px-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Budget Tracker</h1>
          <p className="text-muted-foreground">Manage your money, one transaction at a time</p>
        </div>

        {/* Summary */}
        {isLoaded && <Summary transactions={transactions} />}

        {/* Calculator */}
        <Calculator onAddTransaction={addTransaction} />

        {/* Transactions History */}
        {isLoaded && (
          <TransactionHistory
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
            onClearAll={clearAllTransactions}
          />
        )}
      </div>
    </main>
  );
}
