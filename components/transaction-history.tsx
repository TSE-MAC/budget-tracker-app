'use client';

import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  note: string;
  date: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  onClearAll: () => void;
}

export default function TransactionHistory({
  transactions,
  onDeleteTransaction,
  onClearAll,
}: TransactionHistoryProps) {
  if (transactions.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center shadow-lg">
        <div className="text-muted-foreground mb-2">No transactions yet</div>
        <p className="text-sm text-muted-foreground">
          Add your first income or expense to get started
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-bold">Transaction History</h2>
        <Button
          onClick={onClearAll}
          variant="ghost"
          size="sm"
          className="text-primary-foreground hover:bg-primary/80"
        >
          Clear All
        </Button>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-border max-h-96 overflow-y-auto">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="px-6 py-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    transaction.type === 'income' ? 'bg-accent' : 'bg-destructive'
                  }`}
                />
                <div>
                  <div className="font-semibold text-primary">{transaction.note}</div>
                  <div className="text-xs text-muted-foreground">{transaction.date}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`text-right ${
                  transaction.type === 'income' ? 'text-accent' : 'text-destructive'
                }`}
              >
                <div className="font-bold text-lg">
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
              <Button
                onClick={() => onDeleteTransaction(transaction.id)}
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
