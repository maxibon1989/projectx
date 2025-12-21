'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  Member,
  FamilyGroup,
  House,
  Stay,
  BoardPost,
  ShoppingItem,
  Issue,
  Notification,
  ChecklistItem,
  Room,
} from '@/types';
import {
  saveToStorage,
  loadFromStorage,
  STORAGE_KEYS,
  generateId,
  createDefaultArrivalChecklist,
  createDefaultDepartureChecklist,
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
} from '@/data/sampleData';

// State type
interface AppState {
  currentUser: Member | null;
  familyGroup: FamilyGroup | null;
  houses: House[];
  stays: Stay[];
  boardPosts: BoardPost[];
  shoppingItems: ShoppingItem[];
  issues: Issue[];
  notifications: Notification[];
  isLoading: boolean;
  selectedHouseId: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CURRENT_USER'; payload: Member | null }
  | { type: 'SET_FAMILY_GROUP'; payload: FamilyGroup | null }
  | { type: 'SET_HOUSES'; payload: House[] }
  | { type: 'ADD_HOUSE'; payload: House }
  | { type: 'UPDATE_HOUSE'; payload: House }
  | { type: 'DELETE_HOUSE'; payload: string }
  | { type: 'SET_SELECTED_HOUSE'; payload: string | null }
  | { type: 'ADD_ROOM'; payload: { houseId: string; room: Room } }
  | { type: 'UPDATE_ROOM'; payload: { houseId: string; room: Room } }
  | { type: 'DELETE_ROOM'; payload: { houseId: string; roomId: string } }
  | { type: 'SET_STAYS'; payload: Stay[] }
  | { type: 'ADD_STAY'; payload: Stay }
  | { type: 'UPDATE_STAY'; payload: Stay }
  | { type: 'DELETE_STAY'; payload: string }
  | { type: 'UPDATE_STAY_CHECKLIST'; payload: { stayId: string; type: 'arrival' | 'departure'; checklist: ChecklistItem[] } }
  | { type: 'SET_BOARD_POSTS'; payload: BoardPost[] }
  | { type: 'ADD_BOARD_POST'; payload: BoardPost }
  | { type: 'UPDATE_BOARD_POST'; payload: BoardPost }
  | { type: 'DELETE_BOARD_POST'; payload: string }
  | { type: 'SET_SHOPPING_ITEMS'; payload: ShoppingItem[] }
  | { type: 'ADD_SHOPPING_ITEM'; payload: ShoppingItem }
  | { type: 'UPDATE_SHOPPING_ITEM'; payload: ShoppingItem }
  | { type: 'DELETE_SHOPPING_ITEM'; payload: string }
  | { type: 'MARK_ITEM_BOUGHT'; payload: { itemId: string; boughtBy: string } }
  | { type: 'SET_ISSUES'; payload: Issue[] }
  | { type: 'ADD_ISSUE'; payload: Issue }
  | { type: 'UPDATE_ISSUE'; payload: Issue }
  | { type: 'DELETE_ISSUE'; payload: string }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'MARK_ALL_NOTIFICATIONS_READ' }
  | { type: 'LOAD_SAMPLE_DATA' }
  | { type: 'CLEAR_DATA' };

// Initial state
const initialState: AppState = {
  currentUser: null,
  familyGroup: null,
  houses: [],
  stays: [],
  boardPosts: [],
  shoppingItems: [],
  issues: [],
  notifications: [],
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

    case 'LOAD_SAMPLE_DATA':
      return {
        ...state,
        currentUser: sampleCurrentUser,
        familyGroup: sampleFamilyGroup,
        houses: sampleHouses,
        stays: sampleStays,
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
  // Helper functions
  getHouseById: (id: string) => House | undefined;
  getStaysForHouse: (houseId: string) => Stay[];
  getActiveStay: (houseId: string) => Stay | undefined;
  getUpcomingStays: (houseId: string) => Stay[];
  getBoardPostsForHouse: (houseId: string) => BoardPost[];
  getShoppingItemsForHouse: (houseId: string) => ShoppingItem[];
  getIssuesForHouse: (houseId: string) => Issue[];
  getMemberById: (id: string) => Member | undefined;
  getUnreadNotificationsCount: () => number;
  createHouse: (name: string, address?: string, nickname?: string) => void;
  createStay: (stay: Omit<Stay, 'id' | 'createdAt' | 'arrivalChecklist' | 'departureChecklist'>) => void;
  createBoardPost: (houseId: string, content: string) => void;
  createShoppingItem: (item: Omit<ShoppingItem, 'id' | 'createdAt'>) => void;
  createIssue: (issue: Omit<Issue, 'id' | 'createdAt'>) => void;
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
      const storedFamilyGroup = loadFromStorage<FamilyGroup>(STORAGE_KEYS.FAMILY_GROUP);
      const storedHouses = loadFromStorage<House[]>(STORAGE_KEYS.HOUSES);

      if (storedUser && storedFamilyGroup && storedHouses) {
        dispatch({ type: 'SET_CURRENT_USER', payload: storedUser });
        dispatch({ type: 'SET_FAMILY_GROUP', payload: storedFamilyGroup });
        dispatch({ type: 'SET_HOUSES', payload: storedHouses });
        dispatch({ type: 'SET_STAYS', payload: loadFromStorage<Stay[]>(STORAGE_KEYS.STAYS) || [] });
        dispatch({ type: 'SET_BOARD_POSTS', payload: loadFromStorage<BoardPost[]>(STORAGE_KEYS.BOARD_POSTS) || [] });
        dispatch({ type: 'SET_SHOPPING_ITEMS', payload: loadFromStorage<ShoppingItem[]>(STORAGE_KEYS.SHOPPING_ITEMS) || [] });
        dispatch({ type: 'SET_ISSUES', payload: loadFromStorage<Issue[]>(STORAGE_KEYS.ISSUES) || [] });
        dispatch({ type: 'SET_NOTIFICATIONS', payload: loadFromStorage<Notification[]>(STORAGE_KEYS.NOTIFICATIONS) || [] });
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
      saveToStorage(STORAGE_KEYS.BOARD_POSTS, state.boardPosts);
      saveToStorage(STORAGE_KEYS.SHOPPING_ITEMS, state.shoppingItems);
      saveToStorage(STORAGE_KEYS.ISSUES, state.issues);
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, state.notifications);
    }
  }, [state]);

  // Helper functions
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
      .filter((s) => s.houseId === houseId && s.status === 'planned' && new Date(s.startDate) > now)
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
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
      .filter((i) => i.houseId === houseId)
      .sort((a, b) => {
        const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

  const getIssuesForHouse = (houseId: string) =>
    state.issues
      .filter((i) => i.houseId === houseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getMemberById = (id: string) => state.familyGroup?.members.find((m) => m.id === id);

  const getUnreadNotificationsCount = () => state.notifications.filter((n) => !n.read).length;

  const createHouse = (name: string, address?: string, nickname?: string) => {
    const newHouse: House = {
      id: generateId(),
      familyGroupId: state.familyGroup?.id || '',
      name,
      address,
      nickname,
      photos: [],
      rules: [],
      rooms: [],
      defaultArrivalChecklist: createDefaultArrivalChecklist(),
      defaultDepartureChecklist: createDefaultDepartureChecklist(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_HOUSE', payload: newHouse });
  };

  const createStay = (stayData: Omit<Stay, 'id' | 'createdAt' | 'arrivalChecklist' | 'departureChecklist'>) => {
    const house = getHouseById(stayData.houseId);
    const newStay: Stay = {
      ...stayData,
      id: generateId(),
      arrivalChecklist: house?.defaultArrivalChecklist.map((item) => ({ ...item, id: generateId(), checked: false })) || createDefaultArrivalChecklist(),
      departureChecklist: house?.defaultDepartureChecklist.map((item) => ({ ...item, id: generateId(), checked: false })) || createDefaultDepartureChecklist(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_STAY', payload: newStay });
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

  const createShoppingItem = (itemData: Omit<ShoppingItem, 'id' | 'createdAt'>) => {
    const newItem: ShoppingItem = {
      ...itemData,
      id: generateId(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_SHOPPING_ITEM', payload: newItem });
  };

  const createIssue = (issueData: Omit<Issue, 'id' | 'createdAt'>) => {
    const newIssue: Issue = {
      ...issueData,
      id: generateId(),
      createdAt: new Date(),
    };
    dispatch({ type: 'ADD_ISSUE', payload: newIssue });
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    getHouseById,
    getStaysForHouse,
    getActiveStay,
    getUpcomingStays,
    getBoardPostsForHouse,
    getShoppingItemsForHouse,
    getIssuesForHouse,
    getMemberById,
    getUnreadNotificationsCount,
    createHouse,
    createStay,
    createBoardPost,
    createShoppingItem,
    createIssue,
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
