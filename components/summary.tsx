'use client';

interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  note: string;
  date: string;
}

interface SummaryProps {
  transactions: Transaction[];
}

export default function Summary({ transactions }: SummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {/* Income */}
      <div className="bg-accent text-accent-foreground rounded-lg p-4 text-center shadow">
        <div className="text-xs font-semibold opacity-90 mb-1">Income</div>
        <div className="text-2xl font-bold">₹{totalIncome.toFixed(2)}</div>
      </div>

      {/* Expenses */}
      <div className="bg-destructive text-destructive-foreground rounded-lg p-4 text-center shadow">
        <div className="text-xs font-semibold opacity-90 mb-1">Expenses</div>
        <div className="text-2xl font-bold">₹{totalExpense.toFixed(2)}</div>
      </div>

      {/* Balance */}
      <div
        className={`rounded-lg p-4 text-center shadow ${
          balance >= 0
            ? 'bg-accent text-accent-foreground'
            : 'bg-destructive text-destructive-foreground'
        }`}
      >
        <div className="text-xs font-semibold opacity-90 mb-1">Balance</div>
        <div className="text-2xl font-bold">₹{balance.toFixed(2)}</div>
      </div>
    </div>
  );
}
