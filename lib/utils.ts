// Utility functions for Family Home Planner

import { ChecklistItem, Member, UserRole } from '@/types';

// Generate unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Format date for display
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Format date range
export function formatDateRange(start: Date | string, end: Date | string): string {
  const startDate = typeof start === 'string' ? new Date(start) : start;
  const endDate = typeof end === 'string' ? new Date(end) : end;

  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return `${startStr} - ${endStr}`;
}

// Format relative time
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return formatDate(d);
}

// Check if date ranges overlap
export function datesOverlap(
  start1: Date | string,
  end1: Date | string,
  start2: Date | string,
  end2: Date | string
): boolean {
  const s1 = typeof start1 === 'string' ? new Date(start1) : start1;
  const e1 = typeof end1 === 'string' ? new Date(end1) : end1;
  const s2 = typeof start2 === 'string' ? new Date(start2) : start2;
  const e2 = typeof end2 === 'string' ? new Date(end2) : end2;

  return s1 <= e2 && e1 >= s2;
}

// Get days between dates
export function getDaysBetween(start: Date | string, end: Date | string): number {
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  const diff = e.getTime() - s.getTime();
  return Math.ceil(diff / 86400000);
}

// Check if date is today
export function isToday(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

// Check if date is in the past
export function isPast(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

// Check if date is within range
export function isWithinRange(date: Date | string, start: Date | string, end: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const s = typeof start === 'string' ? new Date(start) : start;
  const e = typeof end === 'string' ? new Date(end) : end;
  return d >= s && d <= e;
}

// Create default checklist items
export function createDefaultArrivalChecklist(): ChecklistItem[] {
  return [
    { id: generateId(), text: 'Turn on water supply', checked: false },
    { id: generateId(), text: 'Turn on heating/AC', checked: false },
    { id: generateId(), text: 'Air out rooms', checked: false },
    { id: generateId(), text: 'Check fridge and pantry', checked: false },
    { id: generateId(), text: 'Make beds', checked: false },
    { id: generateId(), text: 'Check for any issues', checked: false },
  ];
}

export function createDefaultDepartureChecklist(): ChecklistItem[] {
  return [
    { id: generateId(), text: 'Clean kitchen', checked: false },
    { id: generateId(), text: 'Empty and clean fridge', checked: false },
    { id: generateId(), text: 'Wash and put away towels', checked: false },
    { id: generateId(), text: 'Take out trash', checked: false },
    { id: generateId(), text: 'Turn off heating/AC', checked: false },
    { id: generateId(), text: 'Lock all doors and windows', checked: false },
    { id: generateId(), text: 'Turn off water supply', checked: false },
  ];
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: 'Admin',
    adult: 'Adult',
    child: 'Child',
    guest: 'Guest',
  };
  return names[role];
}

// Get role permissions
export function canManageHouses(role: UserRole): boolean {
  return role === 'admin';
}

export function canCreateStays(role: UserRole): boolean {
  return role === 'admin' || role === 'adult';
}

export function canManageMembers(role: UserRole): boolean {
  return role === 'admin';
}

export function canEditChecklist(role: UserRole): boolean {
  return role !== 'guest';
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Get member by ID
export function getMemberById(members: Member[], id: string): Member | undefined {
  return members.find((m) => m.id === id);
}

// Generate invite code
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Color palette for stays
export const stayColors = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
];

export function getStayColor(index: number): string {
  return stayColors[index % stayColors.length];
}

// Local storage helpers
export function saveToStorage<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

export function loadFromStorage<T>(key: string): T | null {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data) as T;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function removeFromStorage(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// Storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'homeplan_current_user',
  FAMILY_GROUP: 'homeplan_family_group',
  HOUSES: 'homeplan_houses',
  STAYS: 'homeplan_stays',
  BOARD_POSTS: 'homeplan_board_posts',
  SHOPPING_ITEMS: 'homeplan_shopping_items',
  ISSUES: 'homeplan_issues',
  NOTIFICATIONS: 'homeplan_notifications',
};

// Classname helper
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
