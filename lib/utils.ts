import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTermStatus(startDate: string | null | undefined, endDate: string | null | undefined): 'active' | 'past' | 'upcoming' | 'unscheduled' {
  if (!startDate || !endDate) return 'unscheduled';
  
  const current = new Date();
  // Normalize current date to remove time for fair comparison
  current.setHours(0, 0, 0, 0);

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  if (current >= start && current <= end) return 'active';
  if (current > end) return 'past';
  return 'upcoming';
}
