// Core Types for Family Home Planner

// User Roles
export type UserRole = 'admin' | 'adult' | 'child' | 'guest';

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

// Family Group
export interface FamilyGroup {
  id: string;
  name: string;
  members: Member[];
  houses: string[]; // House IDs
  createdAt: Date;
  inviteCode?: string;
}

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
  rooms: Room[];
  defaultArrivalChecklist: ChecklistItem[];
  defaultDepartureChecklist: ChecklistItem[];
  createdAt: Date;
}

// Stay Status
export type StayStatus = 'planned' | 'active' | 'completed' | 'cancelled';

// Room Assignment during a Stay
export interface RoomAssignment {
  roomId: string;
  memberIds: string[];
  notes?: string;
  issues?: string[];
}

// Stay
export interface Stay {
  id: string;
  houseId: string;
  startDate: Date;
  endDate: Date;
  attendees: string[]; // Member IDs
  roomAssignments: RoomAssignment[];
  arrivalNotes?: string;
  departureNotes?: string;
  arrivalChecklist: ChecklistItem[];
  departureChecklist: ChecklistItem[];
  status: StayStatus;
  createdBy: string;
  createdAt: Date;
  color?: string; // For calendar display
}

// Board Post
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
  createdAt: Date;
}

// Issue Status
export type IssueStatus = 'open' | 'planned' | 'in_progress' | 'fixed';

// Issue/Maintenance
export interface Issue {
  id: string;
  houseId: string;
  roomId?: string;
  title: string;
  description: string;
  photos: string[];
  status: IssueStatus;
  reportedBy: string;
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
}

// Notification Types
export type NotificationType =
  | 'stay_reminder'
  | 'overlap_warning'
  | 'checklist_pending'
  | 'new_board_post'
  | 'new_issue'
  | 'issue_assigned'
  | 'shopping_item_added';

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
}

// App State
export interface AppState {
  currentUser: Member | null;
  familyGroup: FamilyGroup | null;
  houses: House[];
  stays: Stay[];
  boardPosts: BoardPost[];
  shoppingItems: ShoppingItem[];
  issues: Issue[];
  notifications: Notification[];
}
