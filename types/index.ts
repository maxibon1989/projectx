// Core Types for Rental House Operating System

// User Roles for Rental Properties
export type UserRole = 'owner' | 'cohost' | 'guest' | 'cleaner';

// User/Member
export interface Member {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
}

// Property Group (replaces Family Group)
export interface PropertyGroup {
  id: string;
  name: string;
  members: Member[];
  houses: string[]; // House IDs
  createdAt: Date;
  inviteCode?: string;
}

// For backwards compatibility
export type FamilyGroup = PropertyGroup;

// Room Types
export type RoomType = 'bedroom' | 'guest_room' | 'storage' | 'office' | 'living_room' | 'kitchen' | 'bathroom' | 'other';

// Room
export interface Room {
  id: string;
  houseId: string;
  name: string;
  type: RoomType;
  capacity: number;
  notes?: string;
  photo?: string;
}

// Checklist Item
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  comment?: string;
  hasIssue?: boolean;
  checkedBy?: string;
  checkedAt?: Date;
  assignedTo?: string; // Member ID for owner assignment
  roomId?: string; // Optional room link
}

// House Rules (versioned)
export interface HouseRulesVersion {
  id: string;
  version: number;
  rules: string[];
  createdAt: Date;
  createdBy: string;
}

// Safety Information
export interface SafetyInfo {
  emergencyContacts: EmergencyContact[];
  fireExtinguisherLocation: string;
  waterShutoff: string;
  electricMainSwitch: string;
  gasShutoff?: string;
  additionalInfo?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  type: 'emergency' | 'owner' | 'neighbor' | 'maintenance' | 'other';
}

// House
export interface House {
  id: string;
  familyGroupId: string;
  name: string;
  address?: string;
  nickname?: string;
  photos: string[];
  rules: string[];
  rulesVersion: number;
  rulesHistory?: HouseRulesVersion[];
  rooms: Room[];
  defaultArrivalChecklist: ChecklistItem[];
  defaultDepartureChecklist: ChecklistItem[];
  defaultCleaningChecklist?: ChecklistItem[];
  safetyInfo?: SafetyInfo;
  createdAt: Date;
}

// Stay Status - Updated for rental flow
export type StayStatus = 'requested' | 'planned' | 'confirmed' | 'active' | 'completed' | 'cancelled';

// Room Assignment during a Stay
export interface RoomAssignment {
  roomId: string;
  memberIds: string[];
  notes?: string;
  issues?: string[];
}

// Rules Acknowledgment
export interface RulesAcknowledgment {
  memberId: string;
  rulesVersion: number;
  acknowledgedAt: Date;
}

// Stay Summary (auto-generated after checkout)
export interface StaySummary {
  completedArrivalTasks: number;
  totalArrivalTasks: number;
  completedDepartureTasks: number;
  totalDepartureTasks: number;
  issuesReported: string[]; // Issue IDs
  notes: string;
  generatedAt: Date;
}

// Stay
export interface Stay {
  id: string;
  houseId: string;
  startDate: Date;
  endDate: Date;
  attendees: string[]; // Member IDs (guests)
  guestEmail?: string; // For invite link
  roomAssignments: RoomAssignment[];
  arrivalNotes?: string;
  departureNotes?: string;
  arrivalChecklist: ChecklistItem[];
  departureChecklist: ChecklistItem[];
  arrivalChecklistActive: boolean; // Activates 48h before
  departureChecklistActive: boolean; // Activates evening before checkout
  status: StayStatus;
  rulesAcknowledgments: RulesAcknowledgment[];
  summary?: StaySummary;
  createdBy: string;
  createdAt: Date;
  confirmedBy?: string;
  confirmedAt?: Date;
  color?: string; // For calendar display
}

// Cleaning Task Status
export type CleaningTaskStatus = 'pending' | 'in_progress' | 'completed';

// Cleaning Task (post-checkout)
export interface CleaningTask {
  id: string;
  houseId: string;
  stayId: string;
  assignedTo?: string; // Cleaner ID
  checklist: ChecklistItem[];
  status: CleaningTaskStatus;
  issuesFound: string[]; // Issue IDs
  createdAt: Date;
  completedAt?: Date;
  notes?: string;
}

// Board Post - kept for internal notes (owner/cohost only)
export interface BoardPost {
  id: string;
  houseId: string;
  authorId: string;
  content: string;
  isPinned: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Shopping Item Priority
export type ItemPriority = 'low' | 'normal' | 'high' | 'urgent';

// Shopping Item Category
export type ItemCategory = 'food' | 'cleaning' | 'maintenance' | 'toiletries' | 'other';

// Shopping Item Status for guest suggestions
export type ShoppingItemStatus = 'standard' | 'suggested' | 'approved' | 'rejected';

// Shopping Item
export interface ShoppingItem {
  id: string;
  houseId: string;
  name: string;
  quantity: number;
  priority: ItemPriority;
  category: ItemCategory;
  addedBy: string;
  assignedTo?: string;
  boughtBy?: string;
  boughtAt?: Date;
  status: ShoppingItemStatus; // standard items vs guest suggestions
  isLowStock?: boolean; // Auto-surfaces
  createdAt: Date;
}

// Issue Type for rentals
export type IssueType = 'maintenance' | 'damage' | 'safety';

// Issue Severity
export type IssueSeverity = 'low' | 'medium' | 'high' | 'critical';

// Issue Status
export type IssueStatus = 'open' | 'planned' | 'in_progress' | 'fixed';

// Issue/Maintenance
export interface Issue {
  id: string;
  houseId: string;
  stayId?: string; // Link to stay
  roomId?: string;
  title: string;
  description: string;
  type: IssueType;
  severity: IssueSeverity;
  photos: string[];
  status: IssueStatus;
  reportedBy: string;
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
}

// Notification Types for Rental Operations
export type NotificationType =
  | 'stay_reminder'
  | 'stay_requested'
  | 'stay_confirmed'
  | 'checklist_incomplete'
  | 'checklist_activated'
  | 'safety_issue'
  | 'new_issue'
  | 'issue_assigned'
  | 'guest_arrived'
  | 'guest_checked_out'
  | 'cleaning_required'
  | 'cleaning_completed'
  | 'rules_updated'
  | 'supply_suggestion';

// Notification
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  houseId?: string;
  stayId?: string;
  issueId?: string;
  read: boolean;
  createdAt: Date;
  recipientRole?: UserRole; // For role-based notifications
}

// Guest Onboarding State
export interface GuestOnboarding {
  stayId: string;
  step: 'confirm_dates' | 'read_rules' | 'acknowledge_safety' | 'complete';
  rulesAcknowledged: boolean;
  safetyAcknowledged: boolean;
  completedAt?: Date;
}

// App State
export interface AppState {
  currentUser: Member | null;
  familyGroup: PropertyGroup | null;
  houses: House[];
  stays: Stay[];
  cleaningTasks: CleaningTask[];
  boardPosts: BoardPost[];
  shoppingItems: ShoppingItem[];
  issues: Issue[];
  notifications: Notification[];
  guestOnboarding?: GuestOnboarding;
}

// Permission helpers
export type Permission =
  | 'manage_house'
  | 'manage_stays'
  | 'confirm_stays'
  | 'view_all_stays'
  | 'complete_checklists'
  | 'report_issues'
  | 'close_issues'
  | 'manage_shopping'
  | 'suggest_shopping'
  | 'view_cleaning'
  | 'complete_cleaning'
  | 'view_notes'
  | 'manage_members';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  owner: [
    'manage_house',
    'manage_stays',
    'confirm_stays',
    'view_all_stays',
    'complete_checklists',
    'report_issues',
    'close_issues',
    'manage_shopping',
    'suggest_shopping',
    'view_cleaning',
    'complete_cleaning',
    'view_notes',
    'manage_members',
  ],
  cohost: [
    'manage_stays',
    'view_all_stays',
    'complete_checklists',
    'report_issues',
    'manage_shopping',
    'suggest_shopping',
    'view_cleaning',
    'complete_cleaning',
    'view_notes',
  ],
  guest: [
    'complete_checklists',
    'report_issues',
    'suggest_shopping',
  ],
  cleaner: [
    'view_cleaning',
    'complete_cleaning',
    'report_issues',
  ],
};
