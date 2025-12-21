// Sample data for Family Home Planner

import {
  Member,
  FamilyGroup,
  House,
  Stay,
  BoardPost,
  ShoppingItem,
  Issue,
  Notification,
  Room,
} from '@/types';
import { createDefaultArrivalChecklist, createDefaultDepartureChecklist } from '@/lib/utils';

// Sample Members
export const sampleMembers: Member[] = [
  {
    id: 'member-1',
    name: 'Sarah Johnson',
    email: 'sarah@family.com',
    role: 'admin',
    phone: '+1 555-0101',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'member-2',
    name: 'Michael Johnson',
    email: 'michael@family.com',
    role: 'adult',
    phone: '+1 555-0102',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'member-3',
    name: 'Emma Johnson',
    email: 'emma@family.com',
    role: 'adult',
    phone: '+1 555-0103',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'member-4',
    name: 'Lucas Johnson',
    email: 'lucas@family.com',
    role: 'child',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'member-5',
    name: 'Olivia Johnson',
    email: 'olivia@family.com',
    role: 'child',
    createdAt: new Date('2024-02-01'),
  },
];

// Sample Rooms for Lake House
export const lakeHouseRooms: Room[] = [
  {
    id: 'room-1',
    houseId: 'house-1',
    name: 'Master Bedroom',
    type: 'bedroom',
    capacity: 2,
    notes: 'King bed, ensuite bathroom',
  },
  {
    id: 'room-2',
    houseId: 'house-1',
    name: 'Guest Room',
    type: 'guest_room',
    capacity: 2,
    notes: 'Queen bed, lake view',
  },
  {
    id: 'room-3',
    houseId: 'house-1',
    name: 'Kids Room',
    type: 'bedroom',
    capacity: 3,
    notes: 'Bunk beds + single bed',
  },
  {
    id: 'room-4',
    houseId: 'house-1',
    name: 'Office',
    type: 'office',
    capacity: 1,
    notes: 'Quiet room, good WiFi',
  },
];

// Sample Rooms for Mountain Cabin
export const cabinRooms: Room[] = [
  {
    id: 'room-5',
    houseId: 'house-2',
    name: 'Main Bedroom',
    type: 'bedroom',
    capacity: 2,
    notes: 'Queen bed, fireplace view',
  },
  {
    id: 'room-6',
    houseId: 'house-2',
    name: 'Loft',
    type: 'bedroom',
    capacity: 4,
    notes: 'Two double beds, cozy space',
  },
  {
    id: 'room-7',
    houseId: 'house-2',
    name: 'Storage Room',
    type: 'storage',
    capacity: 0,
    notes: 'Ski gear and hiking equipment',
  },
];

// Sample Houses
export const sampleHouses: House[] = [
  {
    id: 'house-1',
    familyGroupId: 'family-1',
    name: 'Lake House',
    address: '123 Lakeside Drive, Lake Town, CA 92000',
    nickname: 'The Lake Place',
    photos: [],
    rules: [
      'No shoes inside',
      'Quiet hours after 10 PM',
      'Always lock the boat shed',
      'Check propane tank before using grill',
    ],
    rooms: lakeHouseRooms,
    defaultArrivalChecklist: createDefaultArrivalChecklist(),
    defaultDepartureChecklist: createDefaultDepartureChecklist(),
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'house-2',
    familyGroupId: 'family-1',
    name: 'Mountain Cabin',
    address: '456 Pine Ridge Road, Mountain View, CO 80000',
    nickname: 'The Cabin',
    photos: [],
    rules: [
      'Stack firewood after use',
      'Check for wildlife before leaving food out',
      'Winter: run water briefly every day to prevent freezing',
    ],
    rooms: cabinRooms,
    defaultArrivalChecklist: createDefaultArrivalChecklist(),
    defaultDepartureChecklist: createDefaultDepartureChecklist(),
    createdAt: new Date('2024-02-15'),
  },
];

// Sample Family Group
export const sampleFamilyGroup: FamilyGroup = {
  id: 'family-1',
  name: 'The Johnson Family',
  members: sampleMembers,
  houses: ['house-1', 'house-2'],
  createdAt: new Date('2024-01-01'),
  inviteCode: 'JHNFAM24',
};

// Get dates relative to today for sample stays
const today = new Date();
const getDate = (daysFromToday: number): Date => {
  const date = new Date(today);
  date.setDate(date.getDate() + daysFromToday);
  return date;
};

// Sample Stays
export const sampleStays: Stay[] = [
  {
    id: 'stay-1',
    houseId: 'house-1',
    startDate: getDate(-2),
    endDate: getDate(3),
    attendees: ['member-1', 'member-2', 'member-4', 'member-5'],
    roomAssignments: [
      { roomId: 'room-1', memberIds: ['member-1', 'member-2'], notes: '' },
      { roomId: 'room-3', memberIds: ['member-4', 'member-5'], notes: '' },
    ],
    arrivalNotes: 'Arriving around 3 PM',
    arrivalChecklist: createDefaultArrivalChecklist().map((item, i) => ({
      ...item,
      checked: i < 4,
      checkedBy: i < 4 ? 'member-1' : undefined,
    })),
    departureChecklist: createDefaultDepartureChecklist(),
    status: 'active',
    createdBy: 'member-1',
    createdAt: new Date('2024-11-01'),
    color: '#3B82F6',
  },
  {
    id: 'stay-2',
    houseId: 'house-1',
    startDate: getDate(7),
    endDate: getDate(10),
    attendees: ['member-3'],
    roomAssignments: [{ roomId: 'room-2', memberIds: ['member-3'], notes: 'Working remotely' }],
    arrivalNotes: 'Will be working, need quiet',
    arrivalChecklist: createDefaultArrivalChecklist(),
    departureChecklist: createDefaultDepartureChecklist(),
    status: 'planned',
    createdBy: 'member-3',
    createdAt: new Date('2024-11-10'),
    color: '#10B981',
  },
  {
    id: 'stay-3',
    houseId: 'house-2',
    startDate: getDate(14),
    endDate: getDate(21),
    attendees: ['member-1', 'member-2', 'member-3', 'member-4', 'member-5'],
    roomAssignments: [
      { roomId: 'room-5', memberIds: ['member-1', 'member-2'] },
      { roomId: 'room-6', memberIds: ['member-3', 'member-4', 'member-5'] },
    ],
    arrivalNotes: 'Family ski trip!',
    arrivalChecklist: createDefaultArrivalChecklist(),
    departureChecklist: createDefaultDepartureChecklist(),
    status: 'planned',
    createdBy: 'member-1',
    createdAt: new Date('2024-10-15'),
    color: '#8B5CF6',
  },
];

// Sample Board Posts
export const sampleBoardPosts: BoardPost[] = [
  {
    id: 'post-1',
    houseId: 'house-1',
    authorId: 'member-1',
    content:
      'Reminder: The dock needs to be checked before each boat use. Found some loose boards last time.',
    isPinned: true,
    createdAt: getDate(-5),
  },
  {
    id: 'post-2',
    houseId: 'house-1',
    authorId: 'member-3',
    content:
      'Left some extra coffee pods in the pantry. Feel free to use them!',
    isPinned: false,
    createdAt: getDate(-3),
  },
  {
    id: 'post-3',
    houseId: 'house-2',
    authorId: 'member-2',
    content:
      'Please do not use the fireplace without opening the vent first. The handle is on the right side.',
    isPinned: true,
    createdAt: getDate(-10),
  },
  {
    id: 'post-4',
    houseId: 'house-2',
    authorId: 'member-1',
    content:
      'Winter tires are in the storage room for anyone driving up. They fit both cars.',
    isPinned: false,
    createdAt: getDate(-7),
  },
];

// Sample Shopping Items
export const sampleShoppingItems: ShoppingItem[] = [
  {
    id: 'item-1',
    houseId: 'house-1',
    name: 'Toilet Paper',
    quantity: 12,
    priority: 'high',
    category: 'toiletries',
    addedBy: 'member-1',
    createdAt: getDate(-2),
  },
  {
    id: 'item-2',
    houseId: 'house-1',
    name: 'Dish Soap',
    quantity: 1,
    priority: 'normal',
    category: 'cleaning',
    addedBy: 'member-2',
    createdAt: getDate(-1),
  },
  {
    id: 'item-3',
    houseId: 'house-1',
    name: 'Coffee',
    quantity: 2,
    priority: 'normal',
    category: 'food',
    addedBy: 'member-1',
    assignedTo: 'member-3',
    createdAt: getDate(-3),
  },
  {
    id: 'item-4',
    houseId: 'house-2',
    name: 'Firewood',
    quantity: 1,
    priority: 'high',
    category: 'maintenance',
    addedBy: 'member-2',
    createdAt: getDate(-5),
  },
  {
    id: 'item-5',
    houseId: 'house-2',
    name: 'Light bulbs (LED)',
    quantity: 4,
    priority: 'normal',
    category: 'maintenance',
    addedBy: 'member-1',
    createdAt: getDate(-4),
  },
];

// Sample Issues
export const sampleIssues: Issue[] = [
  {
    id: 'issue-1',
    houseId: 'house-1',
    roomId: 'room-3',
    title: 'Lamp not working',
    description: 'The bedside lamp in the kids room stopped working. Might need a new bulb or wiring check.',
    photos: [],
    status: 'open',
    reportedBy: 'member-2',
    createdAt: getDate(-2),
  },
  {
    id: 'issue-2',
    houseId: 'house-1',
    title: 'Deck railing loose',
    description: 'The railing on the lake-facing side of the deck is wobbly. Needs to be tightened or replaced.',
    photos: [],
    status: 'planned',
    reportedBy: 'member-1',
    assignedTo: 'member-2',
    createdAt: getDate(-7),
  },
  {
    id: 'issue-3',
    houseId: 'house-2',
    title: 'Slow drain in bathroom',
    description: 'The bathroom sink is draining slowly. Probably needs to be unclogged.',
    photos: [],
    status: 'in_progress',
    reportedBy: 'member-3',
    assignedTo: 'member-2',
    createdAt: getDate(-10),
  },
];

// Sample Notifications
export const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'stay_reminder',
    title: 'Upcoming Stay',
    message: 'Your stay at Lake House starts in 2 days',
    houseId: 'house-1',
    stayId: 'stay-1',
    read: false,
    createdAt: getDate(-1),
  },
  {
    id: 'notif-2',
    type: 'new_issue',
    title: 'New Issue Reported',
    message: 'Lamp not working reported at Lake House',
    houseId: 'house-1',
    issueId: 'issue-1',
    read: false,
    createdAt: getDate(-2),
  },
  {
    id: 'notif-3',
    type: 'new_board_post',
    title: 'New Board Post',
    message: 'Emma posted on Lake House board',
    houseId: 'house-1',
    read: true,
    createdAt: getDate(-3),
  },
];

// Current user (for demo)
export const currentUser = sampleMembers[0]; // Sarah Johnson as admin
