'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useBudget } from '@/components/budget-context';

const EMOJI_OPTIONS = ['🍔', '🚗', '🛍️', '📄', '💊', '🎮', '📦', '✈️', '📚', '🏠', '💡', '🎬', '☕', '🍕', '🏋️', '🎵'];
const COLOR_OPTIONS = [
  '#f97316', '#3b82f6', '#a855f7', '#ef4444', '#22c55e',
  '#ec4899', '#64748b', '#14b8a6', '#f59e0b', '#6366f1',
  '#84cc16', '#e11d48',
];

export default function CategoriesPage() {
  const { data, isLoaded, addCategory, updateCategory, deleteCategory } = useBudget();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  if (!isLoaded || !data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const resetForm = () => {
    setName('');
    setIcon('📦');
    setColor(COLOR_OPTIONS[0]);
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error('Enter a category name');
      return;
    }
    if (editId) {
      updateCategory(editId, { name: name.trim(), icon, color });
      toast.success('Category updated');
    } else {
      addCategory({ name: name.trim(), icon, color });
      toast.success('Category created');
    }
    resetForm();
  };

  const startEdit = (cat: typeof data.categories[0]) => {
    setEditId(cat.id);
    setName(cat.name);
    setIcon(cat.icon);
    setColor(cat.color);
    setShowForm(true);
  };

  const handleDelete = (id: string, catName: string) => {
    if (window.confirm(`Delete "${catName}"? Its expenses will move to "Other".`)) {
      deleteCategory(id);
      toast.success('Category deleted');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pt-2 animate-fade-in-up">
        <h1 className="text-xl font-bold">Categories</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Add/Edit form (bottom sheet style) */}
      {showForm && (
        <div className="animate-scale-in rounded-3xl bg-card border border-border/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">
              {editId ? 'Edit Category' : 'New Category'}
            </h2>
            <button onClick={resetForm} className="p-2 rounded-xl hover:bg-secondary active:scale-95 transition-all">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full px-4 py-3 rounded-2xl bg-secondary/50 border border-border outline-none focus:border-emerald-500 transition-colors text-sm"
            autoFocus
          />

          {/* Icon picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Icon</p>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setIcon(e)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all active:scale-90 ${
                    icon === e
                      ? 'bg-emerald-500/15 ring-2 ring-emerald-500 scale-110'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Color picker */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium">Color</p>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-xl transition-all active:scale-90 ${
                    color === c ? 'ring-2 ring-offset-2 ring-offset-background scale-110' : ''
                  }`}
                  style={{ backgroundColor: c, ringColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-3 rounded-2xl bg-emerald-500 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Check className="w-4 h-4" />
            {editId ? 'Update' : 'Create'} Category
          </button>
        </div>
      )}

      {/* Category list */}
      <div className="space-y-2">
        {data.categories.map((cat, i) => (
          <div
            key={cat.id}
            className={`animate-fade-in-up stagger-${Math.min(i + 1, 7)} flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50`}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
              style={{ backgroundColor: `${cat.color}18` }}
            >
              {cat.icon}
            </div>
            <span className="flex-1 font-semibold text-sm">{cat.name}</span>
            <button
              onClick={() => startEdit(cat)}
              className="p-2.5 rounded-xl hover:bg-secondary active:scale-95 transition-all"
            >
              <Pencil className="w-4 h-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => handleDelete(cat.id, cat.name)}
              className="p-2.5 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
