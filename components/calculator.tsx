'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface CalculatorProps {
  onAddTransaction: (type: 'income' | 'expense', amount: number, note: string) => void;
}

export default function Calculator({ onAddTransaction }: CalculatorProps) {
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const currency = '₹';

  const handleNumberClick = (num: string) => {
    if (amount === '0') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleDecimal = () => {
    if (!amount.includes('.')) {
      setAmount(amount + '.');
    }
  };

  const handleClear = () => {
    setAmount('0');
  };

  const handleBackspace = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };

  const handleAddTransaction = () => {
    const parsedAmount = parseFloat(amount);
    if (parsedAmount > 0 && note.trim()) {
      onAddTransaction(type, parsedAmount, note.trim());
      setAmount('0');
      setNote('');
      setType('expense');
    }
  };

  const isValidTransaction = parseFloat(amount) > 0 && note.trim().length > 0;

  return (
    <div className="bg-card rounded-lg shadow-lg p-6 mb-6">
      {/* Amount Display */}
      <div className="bg-primary text-primary-foreground rounded-lg p-4 mb-6 text-right">
        <div className="text-sm opacity-75 mb-1">{currency} {type.toUpperCase()}</div>
        <div className="text-4xl font-bold break-words">{currency}{amount}</div>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {['7', '8', '9'].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumberClick(num)}
            variant="outline"
            className="h-14 text-lg font-semibold hover:bg-secondary"
          >
            {num}
          </Button>
        ))}
        {['4', '5', '6'].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumberClick(num)}
            variant="outline"
            className="h-14 text-lg font-semibold hover:bg-secondary"
          >
            {num}
          </Button>
        ))}
        {['1', '2', '3'].map((num) => (
          <Button
            key={num}
            onClick={() => handleNumberClick(num)}
            variant="outline"
            className="h-14 text-lg font-semibold hover:bg-secondary"
          >
            {num}
          </Button>
        ))}
        <Button
          onClick={() => handleNumberClick('0')}
          variant="outline"
          className="col-span-2 h-14 text-lg font-semibold hover:bg-secondary"
        >
          0
        </Button>
        <Button
          onClick={handleDecimal}
          variant="outline"
          className="h-14 text-lg font-semibold hover:bg-secondary bg-transparent"
        >
          .
        </Button>
      </div>

      {/* Control Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <Button
          onClick={handleBackspace}
          variant="outline"
          className="h-12 font-semibold text-sm hover:bg-secondary bg-transparent"
        >
          ← Back
        </Button>
        <Button
          onClick={handleClear}
          variant="outline"
          className="h-12 font-semibold text-sm hover:bg-destructive hover:text-destructive-foreground bg-transparent"
        >
          Clear
        </Button>
      </div>

      {/* Description Input */}
      <input
        type="text"
        placeholder="Description (e.g., Groceries, Salary)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full px-4 py-3 border border-border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      {/* Type Selection */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-muted-foreground mb-2">
          Type
        </label>
        <div className="flex gap-2">
          <Button
            onClick={() => setType('expense')}
            variant={type === 'expense' ? 'default' : 'outline'}
            className={`flex-1 h-10 ${
              type === 'expense'
                ? 'bg-destructive text-destructive-foreground hover:bg-red-600'
                : ''
            }`}
          >
            Expense
          </Button>
          <Button
            onClick={() => setType('income')}
            variant={type === 'income' ? 'default' : 'outline'}
            className={`flex-1 h-10 ${
              type === 'income'
                ? 'bg-accent text-accent-foreground hover:bg-green-600'
                : ''
            }`}
          >
            Income
          </Button>
        </div>
      </div>

      {/* Add Transaction Button */}
      <Button
        onClick={handleAddTransaction}
        disabled={!isValidTransaction}
        className="w-full h-12 text-base font-semibold"
      >
        Add Transaction
      </Button>
    </div>
  );
}
