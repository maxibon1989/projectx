// Utility functions for Rental House Operating System

import { ChecklistItem, Member, UserRole, Permission, ROLE_PERMISSIONS, Stay, House, StaySummary, Issue } from '@/types';

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

// Get hours until date
export function getHoursUntil(date: Date | string): number {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.floor(diff / 3600000);
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

// Check if arrival checklist should be active (48h before arrival)
export function shouldActivateArrivalChecklist(stay: Stay): boolean {
  const hoursUntilArrival = getHoursUntil(stay.startDate);
  return hoursUntilArrival <= 48 && hoursUntilArrival > 0 && stay.status === 'confirmed';
}

// Check if departure checklist should be active (evening before checkout)
export function shouldActivateDepartureChecklist(stay: Stay): boolean {
  const endDate = typeof stay.endDate === 'string' ? new Date(stay.endDate) : stay.endDate;
  const now = new Date();

  // Get evening of day before checkout (6 PM)
  const activationTime = new Date(endDate);
  activationTime.setDate(activationTime.getDate() - 1);
  activationTime.setHours(18, 0, 0, 0);

  return now >= activationTime && stay.status === 'active';
}

// Create default checklist items for arrival
export function createDefaultArrivalChecklist(): ChecklistItem[] {
  return [
    { id: generateId(), text: 'Keys collected', checked: false },
    { id: generateId(), text: 'Heating/AC on', checked: false },
    { id: generateId(), text: 'Water supply on', checked: false },
    { id: generateId(), text: 'WiFi checked', checked: false },
    { id: generateId(), text: 'Air out rooms', checked: false },
    { id: generateId(), text: 'Check for any issues', checked: false },
  ];
}

// Create default checklist items for departure
export function createDefaultDepartureChecklist(): ChecklistItem[] {
  return [
    { id: generateId(), text: 'Take out trash', checked: false },
    { id: generateId(), text: 'Dishwasher running', checked: false },
    { id: generateId(), text: 'Windows closed', checked: false },
    { id: generateId(), text: 'Keys returned', checked: false },
    { id: generateId(), text: 'Turn off heating/AC', checked: false },
    { id: generateId(), text: 'Lock all doors', checked: false },
  ];
}

// Create default checklist items for cleaning
export function createDefaultCleaningChecklist(): ChecklistItem[] {
  return [
    { id: generateId(), text: 'Change all bed linens', checked: false },
    { id: generateId(), text: 'Clean bathrooms', checked: false },
    { id: generateId(), text: 'Clean kitchen', checked: false },
    { id: generateId(), text: 'Vacuum all floors', checked: false },
    { id: generateId(), text: 'Mop hard floors', checked: false },
    { id: generateId(), text: 'Restock toiletries', checked: false },
    { id: generateId(), text: 'Empty all trash bins', checked: false },
    { id: generateId(), text: 'Check for damage', checked: false },
  ];
}

// Create default safety info
export function createDefaultSafetyInfo() {
  return {
    emergencyContacts: [
      { id: generateId(), name: 'Emergency Services', phone: '911', type: 'emergency' as const },
    ],
    fireExtinguisherLocation: '',
    waterShutoff: '',
    electricMainSwitch: '',
  };
}

// Get role display name
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    owner: 'Owner',
    cohost: 'Co-host',
    guest: 'Guest',
    cleaner: 'Cleaner',
  };
  return names[role];
}

// Check if user has permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
}

// Get all permissions for role
export function getPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Role permission checks (legacy compatibility)
export function canManageHouses(role: UserRole): boolean {
  return hasPermission(role, 'manage_house');
}

export function canCreateStays(role: UserRole): boolean {
  return hasPermission(role, 'manage_stays');
}

export function canConfirmStays(role: UserRole): boolean {
  return hasPermission(role, 'confirm_stays');
}

export function canManageMembers(role: UserRole): boolean {
  return hasPermission(role, 'manage_members');
}

export function canEditChecklist(role: UserRole): boolean {
  return hasPermission(role, 'complete_checklists');
}

export function canCloseIssues(role: UserRole): boolean {
  return hasPermission(role, 'close_issues');
}

export function canViewNotes(role: UserRole): boolean {
  return hasPermission(role, 'view_notes');
}

// Get stay status display
export function getStayStatusDisplay(status: string): string {
  const displays: Record<string, string> = {
    requested: 'Requested',
    planned: 'Planned',
    confirmed: 'Confirmed',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return displays[status] || status;
}

// Get stay status color
export function getStayStatusColor(status: string): string {
  const colors: Record<string, string> = {
    requested: 'warning',
    planned: 'info',
    confirmed: 'success',
    active: 'success',
    completed: 'neutral',
    cancelled: 'danger',
  };
  return colors[status] || 'default';
}

// Generate stay summary after checkout
export function generateStaySummary(stay: Stay, issues: Issue[]): StaySummary {
  const stayIssues = issues.filter(i => i.stayId === stay.id);

  return {
    completedArrivalTasks: stay.arrivalChecklist.filter(i => i.checked).length,
    totalArrivalTasks: stay.arrivalChecklist.length,
    completedDepartureTasks: stay.departureChecklist.filter(i => i.checked).length,
    totalDepartureTasks: stay.departureChecklist.length,
    issuesReported: stayIssues.map(i => i.id),
    notes: '',
    generatedAt: new Date(),
  };
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

// Generate guest invite link
export function generateGuestInviteLink(stayId: string): string {
  const code = generateInviteCode();
  return `${typeof window !== 'undefined' ? window.location.origin : ''}/guest/invite/${stayId}/${code}`;
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

// Issue type display
export function getIssueTypeDisplay(type: string): string {
  const displays: Record<string, string> = {
    maintenance: 'Maintenance',
    damage: 'Damage',
    safety: 'Safety',
  };
  return displays[type] || type;
}

// Issue severity display
export function getIssueSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'neutral',
    medium: 'info',
    high: 'warning',
    critical: 'danger',
  };
  return colors[severity] || 'default';
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
  CURRENT_USER: 'rentalos_current_user',
  FAMILY_GROUP: 'rentalos_property_group',
  HOUSES: 'rentalos_houses',
  STAYS: 'rentalos_stays',
  CLEANING_TASKS: 'rentalos_cleaning_tasks',
  BOARD_POSTS: 'rentalos_board_posts',
  SHOPPING_ITEMS: 'rentalos_shopping_items',
  ISSUES: 'rentalos_issues',
  NOTIFICATIONS: 'rentalos_notifications',
  GUEST_ONBOARDING: 'rentalos_guest_onboarding',
};

// Classname helper
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
