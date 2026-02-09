import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number with up to two decimal places,
 * removing any trailing zeros (e.g. 123.00 -> "123", 123.50 -> "123.5").
 */
export function formatAmount(value: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0'
  return value.toFixed(2).replace(/\.?0+$/, '')
}
