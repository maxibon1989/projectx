'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Member,
  PropertyGroup,
  House,
  Stay,
  BoardPost,
  ShoppingItem,
  Issue,
  Notification,
  ChecklistItem,
  Room,
  CleaningTask,
  GuestOnboarding,
  UserRole,
  Permission,
  ROLE_PERMISSIONS,
  StaySummary,
} from '@/types';
import {
  saveToStorage,
  loadFromStorage,
  STORAGE_KEYS,
  generateId,
  createDefaultArrivalChecklist,
  createDefaultDepartureChecklist,
  createDefaultCleaningChecklist,
  shouldActivateArrivalChecklist,
  shouldActivateDepartureChecklist,
  generateStaySummary,
} from '@/lib/utils';
import {
  currentUser as sampleCurrentUser,
  sampleFamilyGroup,
  sampleHouses,
  sampleStays,
  sampleBoardPosts,
  sampleShoppingItems,
  sampleIssues,
  sampleNotifications,
  sampleCleaningTasks,
} from '@/data/sampleData';

// State type
interface AppState {
  currentUser: Member | null;
  familyGroup: PropertyGroup | null;
  houses: House[];
  stays: Stay[];
  cleaningTasks: CleaningTask[];
  boardPosts: BoardPost[];
  shoppingItems: ShoppingItem[];
  issues: Issue[];
  notifications: Notification[];
  guestOnboarding: GuestOnboarding | null;
  isLoading: boolean;
  selectedHouseId: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: Member | null }
  | { type: 'SET_FAMILY_GROUP'; payload: PropertyGroup | null }
  | { type: 'SET_HOUSES'; payload: House[] }
  | { type: 'ADD_HOUSE'; payload: House }
  | { type: 'UPDATE_HOUSE'; payload: House }
  | { type: 'DELETE_HOUSE'; payload: string }
  | { type: 'SET_SELECTED_HOUSE'; payload: string | null }
  | { type: 'ADD_ROOM'; payload: { houseId: string; room: Room } }
  | { type: 'UPDATE_ROOM'; payload: { houseId: string; room: Room } }
  | { type: 'DELETE_ROOM'; payload: { houseId: string; roomId: string } }
  | { type: 'UPDATE_HOUSE_RULES'; payload: { houseId: string; rules: string[] } }
  | { type: 'SET_STAYS'; payload: Stay[] }
  | { type: 'ADD_STAY'; payload: Stay }
  | { type: 'UPDATE_STAY'; payload: Stay }
  | { type: 'DELETE_STAY'; payload: string }
  | { type: 'CONFIRM_STAY'; payload: { stayId: string; confirmedBy: string } }
  | { type: 'COMPLETE_STAY'; payload: { stayId: string; summary: StaySummary } }
  | { type: 'UPDATE_STAY_CHECKLIST'; payload: { stayId: string; type: 'arrival' | 'departure'; checklist: ChecklistItem[] } }
  | { type: 'ACKNOWLEDGE_RULES'; payload: { stayId: string; memberId: string; rulesVersion: number } }
  | { type: 'SET_CLEANING_TASKS'; payload: CleaningTask[] }
  | { type: 'ADD_CLEANING_TASK'; payload: CleaningTask }
  | { type: 'UPDATE_CLEANING_TASK'; payload: CleaningTask }
  | { type: 'SET_BOARD_POSTS'; payload: BoardPost[] }
  | { type: 'ADD_BOARD_POST'; payload: BoardPost }
  | { type: 'UPDATE_BOARD_POST'; payload: BoardPost }
  | { type: 'DELETE_BOARD_POST'; payload: string }
  | { type: 'SET_SHOPPING_ITEMS'; payload: ShoppingItem[] }
  | { type: 'ADD_SHOPPING_ITEM'; payload: ShoppingItem }
  | { type: 'UPDATE_SHOPPING_ITEM'; payload: ShoppingItem }
  | { type: 'DELETE_SHOPPING_ITEM'; payload: string }
  | { type: 'MARK_ITEM_BOUGHT'; payload: { itemId: string; boughtBy: string } }
  | { type: 'APPROVE_SHOPPING_SUGGESTION'; payload: string }
  | { type: 'REJECT_SHOPPING_SUGGESTION'; payload: string }
  | { type: 'SET_ISSUES'; payload: Issue[] }
  | { type: 'ADD_ISSUE'; payload: Issue }
  | { type: 'UPDATE_ISSUE'; payload: Issue }
  | { type: 'DELETE_ISSUE'; payload: string }
  | { type: 'CLOSE_ISSUE'; payload: { issueId: string; resolvedBy: string } }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'SET_GUEST_ONBOARDING'; payload: GuestOnboarding | null }
  | { type: 'UPDATE_GUEST_ONBOARDING'; payload: Partial<GuestOnboarding> }
  | { type: 'LOAD_SAMPLE_DATA' }
  | { type: 'CLEAR_DATA' };

// Initial state
const initialState: AppState = {
  currentUser: null,
  familyGroup: null,
  houses: [],
  stays: [],
  cleaningTasks: [],
  boardPosts: [],
  shoppingItems: [],
  issues: [],
  notifications: [],
  guestOnboarding: null,
  isLoading: true,
  selectedHouseId: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };

    case 'SET_FAMILY_GROUP':
      return { ...state, familyGroup: action.payload };

    case 'SET_HOUSES':
      return { ...state, houses: action.payload };

    case 'ADD_HOUSE':
      return { ...state, houses: [...state.houses, action.payload] };

    case 'UPDATE_HOUSE':
      return {
        ...state,
        houses: state.houses.map((h) => (h.id === action.payload.id ? action.payload : h)),
      };

    case 'DELETE_HOUSE':
      return {
        ...state,
        houses: state.houses.filter((h) => h.id !== action.payload),
        selectedHouseId: state.selectedHouseId === action.payload ? null : state.selectedHouseId,
      };

    case 'SET_SELECTED_HOUSE':
      return { ...state, selectedHouseId: action.payload };

    case 'ADD_ROOM':
      return {
        ...state,
        houses: state.houses.map((h) =>
          h.id === action.payload.houseId
            ? { ...h, rooms: [...h.rooms, action.payload.room] }
            : h
        ),
      };

    case 'UPDATE_ROOM':
      return {
        ...state,
        houses: state.houses.map((h) =>
          h.id === action.payload.houseId
            ? {
                ...h,
                rooms: h.rooms.map((r) =>
                  r.id === action.payload.room.id ? action.payload.room : r
                ),
              }
            : h
        ),
      };

    case 'DELETE_ROOM':
      return {
        ...state,
        houses: state.houses.map((h) =>
          h.id === action.payload.houseId
            ? { ...h, rooms: h.rooms.filter((r) => r.id !== action.payload.roomId) }
            : h
        ),
      };

    case 'UPDATE_HOUSE_RULES':
      return {
        ...state,
        houses: state.houses.map((h) =>
          h.id === action.payload.houseId
            ? {
                ...h,
                rules: action.payload.rules,
                rulesVersion: (h.rulesVersion || 0) + 1,
                rulesHistory: [
                  ...(h.rulesHistory || []),
                  {
                    id: generateId(),
                    version: (h.rulesVersion || 0) + 1,
                    rules: action.payload.rules,
                    createdAt: new Date(),
                    createdBy: state.currentUser?.id || '',
                  },
                ],
              }
            : h
        ),
      };

    case 'SET_STAYS':
      return { ...state, stays: action.payload };

    case 'ADD_STAY':
      return { ...state, stays: [...state.stays, action.payload] };

    case 'UPDATE_STAY':
      return {
        ...state,
        stays: state.stays.map((s) => (s.id === action.payload.id ? action.payload : s)),
      };

    case 'DELETE_STAY':
      return { ...state, stays: state.stays.filter((s) => s.id !== action.payload) };

    case 'CONFIRM_STAY':
      return {
        ...state,
        stays: state.stays.map((s) =>
          s.id === action.payload.stayId
            ? {
                ...s,
                status: 'confirmed' as const,
                confirmedBy: action.payload.confirmedBy,
                confirmedAt: new Date(),
              }
            : s
        ),
      };

    case 'COMPLETE_STAY':
      return {
        ...state,
        stays: state.stays.map((s) =>
          s.id === action.payload.stayId
            ? {
                ...s,
                status: 'completed' as const,
                summary: action.payload.summary,
              }
            : s
        ),
      };

    case 'UPDATE_STAY_CHECKLIST':
      return {
        ...state,
        stays: state.stays.map((s) =>
          s.id === action.payload.stayId
            ? {
                ...s,
                [action.payload.type === 'arrival' ? 'arrivalChecklist' : 'departureChecklist']:
                  action.payload.checklist,
              }
            : s
        ),
      };

    case 'ACKNOWLEDGE_RULES':
      return {
        ...state,
        stays: state.stays.map((s) =>
          s.id === action.payload.stayId
            ? {
                ...s,
                rulesAcknowledgments: [
                  ...s.rulesAcknowledgments.filter(
                    (a) => a.memberId !== action.payload.memberId
                  ),
                  {
                    memberId: action.payload.memberId,
                    rulesVersion: action.payload.rulesVersion,
                    acknowledgedAt: new Date(),
                  },
                ],
              }
            : s
        ),
      };

    case 'SET_CLEANING_TASKS':
      return { ...state, cleaningTasks: action.payload };

    case 'ADD_CLEANING_TASK':
      return { ...state, cleaningTasks: [...state.cleaningTasks, action.payload] };

    case 'UPDATE_CLEANING_TASK':
      return {
        ...state,
        cleaningTasks: state.cleaningTasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'SET_BOARD_POSTS':
      return { ...state, boardPosts: action.payload };

    case 'ADD_BOARD_POST':
      return { ...state, boardPosts: [action.payload, ...state.boardPosts] };

    case 'UPDATE_BOARD_POST':
      return {
        ...state,
        boardPosts: state.boardPosts.map((p) => (p.id === action.payload.id ? action.payload : p)),
      };

    case 'DELETE_BOARD_POST':
      return { ...state, boardPosts: state.boardPosts.filter((p) => p.id !== action.payload) };

    case 'SET_SHOPPING_ITEMS':
      return { ...state, shoppingItems: action.payload };

    case 'ADD_SHOPPING_ITEM':
      return { ...state, shoppingItems: [...state.shoppingItems, action.payload] };

    case 'UPDATE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((i) =>
          i.id === action.payload.id ? action.payload : i
        ),
      };

    case 'DELETE_SHOPPING_ITEM':
      return { ...state, shoppingItems: state.shoppingItems.filter((i) => i.id !== action.payload) };

    case 'MARK_ITEM_BOUGHT':
      return {
        ...state,
        shoppingItems: state.shoppingItems.filter((i) => i.id !== action.payload.itemId),
      };

    case 'APPROVE_SHOPPING_SUGGESTION':
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((i) =>
          i.id === action.payload ? { ...i, status: 'approved' as const } : i
        ),
      };

    case 'REJECT_SHOPPING_SUGGESTION':
      return {
        ...state,
        shoppingItems: state.shoppingItems.map((i) =>
          i.id === action.payload ? { ...i, status: 'rejected' as const } : i
        ),
      };

    case 'SET_ISSUES':
      return { ...state, issues: action.payload };

    case 'ADD_ISSUE':
      return { ...state, issues: [...state.issues, action.payload] };

    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((i) => (i.id === action.payload.id ? action.payload : i)),
      };

    case 'DELETE_ISSUE':
      return { ...state, issues: state.issues.filter((i) => i.id !== action.payload) };

    case 'CLOSE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((i) =>
          i.id === action.payload.issueId
            ? {
                ...i,
                status: 'fixed' as const,
                resolvedAt: new Date(),
                resolvedBy: action.payload.resolvedBy,
              }
            : i
        ),
      };

    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };

    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, read: true } : n
        ),
      };

    case 'MARK_ALL_NOTIFICATIONS_READ':
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      };

    case 'SET_GUEST_ONBOARDING':
      return { ...state, guestOnboarding: action.payload };

    case 'UPDATE_GUEST_ONBOARDING':
      return {
        ...state,
        guestOnboarding: state.guestOnboarding
          ? { ...state.guestOnboarding, ...action.payload }
          : null,
      };

    case 'LOAD_SAMPLE_DATA':
      return {
        ...state,
        currentUser: sampleCurrentUser,
        familyGroup: sampleFamilyGroup,
        houses: sampleHouses,
        stays: sampleStays,
        cleaningTasks: sampleCleaningTasks,
        boardPosts: sampleBoardPosts,
        shoppingItems: sampleShoppingItems,
        issues: sampleIssues,
        notifications: sampleNotifications,
        selectedHouseId: sampleHouses[0]?.id || null,
        isLoading: false,
      };

    case 'CLEAR_DATA':
      Object.values(STORAGE_KEYS).forEach(removeFromStorage);
      return { ...initialState, isLoading: false };

    default:
      return state;
  }
}

function removeFromStorage(key: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
}

// Context type
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Permission helpers
  hasPermission: (permission: Permission) => boolean;
  isOwner: () => boolean;
  isCohost: () => boolean;
  isGuest: () => boolean;
  isCleaner: () => boolean;
  // Data helpers
  getHouseById: (id: string) => House | undefined;
  getStaysForHouse: (houseId: string) => Stay[];
  getActiveStay: (houseId: string) => Stay | undefined;
  getUpcomingStays: (houseId: string) => Stay[];
  getRequestedStays: (houseId: string) => Stay[];
  getGuestCurrentStay: () => Stay | undefined;
  getBoardPostsForHouse: (houseId: string) => BoardPost[];
  getShoppingItemsForHouse: (houseId: string) => ShoppingItem[];
  getSuggestedItems: (houseId: string) => ShoppingItem[];
  getLowStockItems: (houseId: string) => ShoppingItem[];
  getIssuesForHouse: (houseId: string) => Issue[];
  getOpenIssuesForHouse: (houseId: string) => Issue[];
  getSafetyIssuesForHouse: (houseId: string) => Issue[];
  getCleaningTasksForHouse: (houseId: string) => CleaningTask[];
  getPendingCleaningTasks: () => CleaningTask[];
  getMemberById: (id: string) => Member | undefined;
  getUnreadNotificationsCount: () => number;
  // CRUD operations
  createHouse: (name: string, address?: string, nickname?: string) => void;
  createStay: (stay: Omit<Stay, 'id' | 'createdAt' | 'arrivalChecklist' | 'departureChecklist' | 'rulesAcknowledgments' | 'arrivalChecklistActive' | 'departureChecklistActive'>) => void;
  confirmStay: (stayId: string) => void;
  completeStay: (stayId: string) => void;
  createCleaningTask: (stayId: string, houseId: string, assignedTo?: string) => void;
  createBoardPost: (houseId: string, content: string) => void;
  createShoppingItem: (item: Omit<ShoppingItem, 'id' | 'createdAt' | 'status'>, isGuest?: boolean) => void;
  createIssue: (issue: Omit<Issue, 'id' | 'createdAt'>) => void;
  closeIssue: (issueId: string) => void;
  acknowledgeRules: (stayId: string) => void;
  // Checklist activation
  checkAndActivateChecklists: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from storage on mount
  useEffect(() => {
    const loadData = () => {
      const storedUser = loadFromStorage<Member>(STORAGE_KEYS.CURRENT_USER);
      const storedFamilyGroup = loadFromStorage<PropertyGroup>(STORAGE_KEYS.FAMILY_GROUP);
      const storedHouses = loadFromStorage<House[]>(STORAGE_KEYS.HOUSES);

      if (storedUser && storedFamilyGroup && storedHouses) {
        dispatch({ type: 'SET_CURRENT_USER', payload: storedUser });
        dispatch({ type: 'SET_FAMILY_GROUP', payload: storedFamilyGroup });
        dispatch({ type: 'SET_HOUSES', payload: storedHouses });
        dispatch({ type: 'SET_STAYS', payload: loadFromStorage<Stay[]>(STORAGE_KEYS.STAYS) || [] });
        dispatch({ type: 'SET_CLEANING_TASKS', payload: loadFromStorage<CleaningTask[]>(STORAGE_KEYS.CLEANING_TASKS) || [] });
        dispatch({ type: 'SET_BOARD_POSTS', payload: loadFromStorage<BoardPost[]>(STORAGE_KEYS.BOARD_POSTS) || [] });
        dispatch({ type: 'SET_SHOPPING_ITEMS', payload: loadFromStorage<ShoppingItem[]>(STORAGE_KEYS.SHOPPING_ITEMS) || [] });
        dispatch({ type: 'SET_ISSUES', payload: loadFromStorage<Issue[]>(STORAGE_KEYS.ISSUES) || [] });
        dispatch({ type: 'SET_NOTIFICATIONS', payload: loadFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [] });
        dispatch({ type: 'SET_GUEST_ONBOARDING', payload: loadFromStorage<GuestOnboarding>(STORAGE_KEYS.GUEST_ONBOARDING) });
        dispatch({ type: 'SET_SELECTED_HOUSE', payload: storedHouses[0]?.id || null });
        dispatch({ type: 'SET_LOADING', payload: false });
      } else {
        // Load sample data for demo
        dispatch({ type: 'LOAD_SAMPLE_DATA' });
      }
    };

    loadData();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    if (!state.isLoading && state.currentUser) {
      saveToStorage(STORAGE_KEYS.CURRENT_USER, state.currentUser);
      saveToStorage(STORAGE_KEYS.FAMILY_GROUP, state.familyGroup);
      saveToStorage(STORAGE_KEYS.HOUSES, state.houses);
      saveToStorage(STORAGE_KEYS.STAYS, state.stays);
      saveToStorage(STORAGE_KEYS.CLEANING_TASKS, state.cleaningTasks);
      saveToStorage(STORAGE_KEYS.BOARD_POSTS, state.boardPosts);
      saveToStorage(STORAGE_KEYS.SHOPPING_ITEMS, state.shoppingItems);
      saveToStorage(STORAGE_KEYS.ISSUES, state.issues);
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
      if (state.guestOnboarding) {
        saveToStorage(STORAGE_KEYS.GUEST_ONBOARDING, state.guestOnboarding);
      }
    }
  }, [state]);

  // Check and activate checklists periodically
  useEffect(() => {
    const checkChecklists = () => {
      state.stays.forEach((stay) => {
        if (shouldActivateArrivalChecklist(stay) && !stay.arrivalChecklistActive) {
          dispatch({
            type: 'UPDATE_STAY',
            payload: { ...stay, arrivalChecklistActive: true },
          });
        }
        if (shouldActivateDepartureChecklist(stay) && !stay.departureChecklistActive) {
          dispatch({
            type: 'UPDATE_STAY',
            payload: { ...stay, departureChecklistActive: true },
          });
        }
      });
    };

    // Check on mount and every 15 minutes
    if (!state.isLoading) {
      checkChecklists();
      const interval = setInterval(checkChecklists, 15 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [state.isLoading, state.stays]);

  // Permission helpers
  const hasPermission = (permission: Permission): boolean => {
    if (!state.currentUser) return false;
    return ROLE_PERMISSIONS[state.currentUser.role]?.includes(permission) || false;
  };

  const isOwner = () => state.currentUser?.role === 'owner';
  const isCohost = () => state.currentUser?.role === 'cohost';
  const isGuest = () => state.currentUser?.role === 'guest';
  const isCleaner = () => state.currentUser?.role === 'cleaner';

  // Data helpers
  const getHouseById = (id: string) => state.houses.find((h) => h.id === id);

  const getStaysForHouse = (houseId: string) =>
    state.stays.filter((s) => s.houseId === houseId).sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

  const getActiveStay = (houseId: string) =>
    state.stays.find((s) => s.houseId === houseId && s.status === 'active');

  const getUpcomingStays = (houseId: string) => {
    const now = new Date();
    return state.stays
      .filter((s) => s.houseId === houseId && (s.status === 'planned' || s.status === 'confirmed') && new Date(s.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  };

  const getRequestedStays = (houseId: string) =>
    state.stays
      .filter((s) => s.houseId === houseId && s.status === 'requested')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const getGuestCurrentStay = () => {
    if (!state.currentUser || state.currentUser.role !== 'guest') return undefined;
    return state.stays.find(
      (s) =>
        s.attendees.includes(state.currentUser!.id) &&
        (s.status === 'active' || s.status === 'confirmed')
    );
  };

  const getBoardPostsForHouse = (houseId: string) =>
    state.boardPosts
      .filter((p) => p.houseId === houseId)
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

  const getShoppingItemsForHouse = (houseId: string) =>
    state.shoppingItems
      .filter((i) => i.houseId === houseId && (i.status === 'standard' || i.status === 'approved'))
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

  const getSuggestedItems = (houseId: string) =>
    state.shoppingItems.filter((i) => i.houseId === houseId && i.status === 'suggested');

  const getLowStockItems = (houseId: string) =>
    state.shoppingItems.filter((i) => i.houseId === houseId && i.isLowStock);

  const getIssuesForHouse = (houseId: string) =>
    state.issues
      .filter((i) => i.houseId === houseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getOpenIssuesForHouse = (houseId: string) =>
    state.issues.filter((i) => i.houseId === houseId && i.status !== 'fixed');

  const getSafetyIssuesForHouse = (houseId: string) =>
    state.issues.filter((i) => i.houseId === houseId && i.type === 'safety' && i.status !== 'fixed');

  const getCleaningTasksForHouse = (houseId: string) =>
    state.cleaningTasks.filter((t) => t.houseId === houseId);

  const getPendingCleaningTasks = () =>
    state.cleaningTasks.filter((t) => t.status !== 'completed');

  const getMemberById = (id: string) => state.familyGroup?.members.find((m) => m.id === id);

  const getUnreadNotificationsCount = () => {
    const userRole = state.currentUser?.role;
    return state.notifications.filter(
      (n) => !n.read && (!n.recipientRole || n.recipientRole === userRole)
    ).length;
  };

  // CRUD operations
  const createHouse = (name: string, address?: string, nickname?: string) => {
    const newHouse: House = {
      id: generateId(),
      familyGroupId: state.familyGroup?.id || '',
      name,
      address,
      nickname,
      photos: [],
      rules: [],
      rulesVersion: 1,
      rooms: [],
      defaultArrivalChecklist: createDefaultArrivalChecklist(),
      defaultDepartureChecklist: createDefaultDepartureChecklist(),
      defaultCleaningChecklist: createDefaultCleaningChecklist(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_HOUSE', payload: newHouse });
  };

  const createStay = (stayData: Omit<Stay, 'id' | 'createdAt' | 'arrivalChecklist' | 'departureChecklist' | 'rulesAcknowledgments' | 'arrivalChecklistActive' | 'departureChecklistActive'>) => {
    const house = getHouseById(stayData.houseId);
    const newStay: Stay = {
      ...stayData,
      id: generateId(),
      arrivalChecklist: house?.defaultArrivalChecklist.map((item) => ({ ...item, id: generateId(), checked: false })) || createDefaultArrivalChecklist(),
      departureChecklist: house?.defaultDepartureChecklist.map((item) => ({ ...item, id: generateId(), checked: false })) || createDefaultDepartureChecklist(),
      arrivalChecklistActive: false,
      departureChecklistActive: false,
      rulesAcknowledgments: [],
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_STAY', payload: newStay });
  };

  const confirmStay = (stayId: string) => {
    if (!state.currentUser || !hasPermission('confirm_stays')) return;
    dispatch({
      type: 'CONFIRM_STAY',
      payload: { stayId, confirmedBy: state.currentUser.id },
    });

    // Add notification
    const stay = state.stays.find((s) => s.id === stayId);
    if (stay) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: generateId(),
          type: 'stay_confirmed',
          title: 'Stay Confirmed',
          message: `Your stay has been confirmed`,
          houseId: stay.houseId,
          stayId,
          read: false,
          createdAt: new Date(),
          recipientRole: 'guest',
        },
      });
    }
  };

  const completeStay = (stayId: string) => {
    const stay = state.stays.find((s) => s.id === stayId);
    if (!stay) return;

    const summary = generateStaySummary(stay, state.issues);
    dispatch({
      type: 'COMPLETE_STAY',
      payload: { stayId, summary },
    });

    // Create cleaning task
    createCleaningTask(stayId, stay.houseId);
  };

  const createCleaningTask = (stayId: string, houseId: string, assignedTo?: string) => {
    const house = getHouseById(houseId);
    const newTask: CleaningTask = {
      id: generateId(),
      houseId,
      stayId,
      assignedTo,
      checklist: house?.defaultCleaningChecklist?.map((item) => ({ ...item, id: generateId(), checked: false })) || createDefaultCleaningChecklist(),
      status: 'pending',
      issuesFound: [],
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_CLEANING_TASK', payload: newTask });

    // Notify cleaner
    if (assignedTo) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: generateId(),
          type: 'cleaning_required',
          title: 'Cleaning Required',
          message: `New cleaning task at ${house?.name || 'property'}`,
          houseId,
          read: false,
          createdAt: new Date(),
          recipientRole: 'cleaner',
        },
      });
    }
  };

  const createBoardPost = (houseId: string, content: string) => {
    const newPost: BoardPost = {
      id: generateId(),
      houseId,
      authorId: state.currentUser?.id || '',
      content,
      isPinned: false,
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_BOARD_POST', payload: newPost });
  };

  const createShoppingItem = (itemData: Omit<ShoppingItem, 'id' | 'createdAt' | 'status'>, isGuestSuggestion = false) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: generateId(),
      status: isGuestSuggestion ? 'suggested' : 'standard',
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_SHOPPING_ITEM', payload: newItem });

    // Notify owner if it's a suggestion
    if (isGuestSuggestion) {
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: generateId(),
          type: 'supply_suggestion',
          title: 'Supply Suggestion',
          message: `Guest suggested: ${itemData.name}`,
          houseId: itemData.houseId,
          read: false,
          createdAt: new Date(),
          recipientRole: 'owner',
        },
      });
    }
  };

  const createIssue = (issueData: Omit<Issue, 'id' | 'createdAt'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: generateId(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_ISSUE', payload: newIssue });

    // Create notification
    const notificationType = issueData.type === 'safety' ? 'safety_issue' : 'new_issue';
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: generateId(),
        type: notificationType,
        title: issueData.type === 'safety' ? 'Safety Issue Reported' : 'New Issue Reported',
        message: issueData.title,
        houseId: issueData.houseId,
        issueId: newIssue.id,
        read: false,
        createdAt: new Date(),
        recipientRole: 'owner',
      },
    });
  };

  const closeIssue = (issueId: string) => {
    if (!state.currentUser || !hasPermission('close_issues')) return;
    dispatch({
      type: 'CLOSE_ISSUE',
      payload: { issueId, resolvedBy: state.currentUser.id },
    });
  };

  const acknowledgeRules = (stayId: string) => {
    if (!state.currentUser) return;
    const stay = state.stays.find((s) => s.id === stayId);
    const house = stay ? getHouseById(stay.houseId) : undefined;
    if (!house) return;

    dispatch({
      type: 'ACKNOWLEDGE_RULES',
      payload: {
        stayId,
        memberId: state.currentUser.id,
        rulesVersion: house.rulesVersion || 1,
      },
    });
  };

  const checkAndActivateChecklists = () => {
    state.stays.forEach((stay) => {
      if (shouldActivateArrivalChecklist(stay) && !stay.arrivalChecklistActive) {
        dispatch({
          type: 'UPDATE_STAY',
          payload: { ...stay, arrivalChecklistActive: true },
        });
      }
      if (shouldActivateDepartureChecklist(stay) && !stay.departureChecklistActive) {
        dispatch({
          type: 'UPDATE_STAY',
          payload: { ...stay, departureChecklistActive: true },
        });
      }
    });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    // Permission helpers
    hasPermission,
    isOwner,
    isCohost,
    isGuest,
    isCleaner,
    // Data helpers
    getHouseById,
    getStaysForHouse,
    getActiveStay,
    getUpcomingStays,
    getRequestedStays,
    getGuestCurrentStay,
    getBoardPostsForHouse,
    getShoppingItemsForHouse,
    getSuggestedItems,
    getLowStockItems,
    getIssuesForHouse,
    getOpenIssuesForHouse,
    getSafetyIssuesForHouse,
    getCleaningTasksForHouse,
    getPendingCleaningTasks,
    getMemberById,
    getUnreadNotificationsCount,
    // CRUD operations
    createHouse,
    createStay,
    confirmStay,
    completeStay,
    createCleaningTask,
    createBoardPost,
    createShoppingItem,
    createIssue,
    closeIssue,
    acknowledgeRules,
    checkAndActivateChecklists,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
