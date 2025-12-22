// Sample data for Rental House Operating System

import {
  Member,
  PropertyGroup,
  FamilyGroup,
  House,
  Stay,
  BoardPost,
  ShoppingItem,
  Issue,
  Notification,
  Room,
  CleaningTask,
  SafetyInfo,
} from '@/types';
import {
  createDefaultArrivalChecklist,
  createDefaultDepartureChecklist,
  createDefaultCleaningChecklist,
  generateId,
} from '@/lib/utils';

// Sample Members - Rental context
export const sampleMembers: Member[] = [
  {
    id: 'member-1',
    name: 'Sarah Mitchell',
    email: 'sarah@rentalowner.com',
    role: 'owner',
    phone: '+1 555-0101',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'member-2',
    name: 'James Wilson',
    email: 'james@cohost.com',
    role: 'cohost',
    phone: '+1 555-0102',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'member-3',
    name: 'Emily Chen',
    email: 'emily@guest.com',
    role: 'guest',
    phone: '+1 555-0103',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'member-4',
    name: 'Michael Brown',
    email: 'michael@guest.com',
    role: 'guest',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'member-5',
    name: 'Lisa Martinez',
    email: 'lisa@cleaningservice.com',
    role: 'cleaner',
    phone: '+1 555-0105',
    createdAt: new Date('2024-02-01'),
  },
];

// Sample Rooms for Lakeside Retreat
export const lakesideRooms: Room[] = [
  {
    id: 'room-1',
    houseId: 'house-1',
    name: 'Master Suite',
    type: 'bedroom',
    capacity: 2,
    notes: 'King bed, private bathroom, lake view',
  },
  {
    id: 'room-2',
    houseId: 'house-1',
    name: 'Guest Bedroom',
    type: 'guest_room',
    capacity: 2,
    notes: 'Queen bed, shared bathroom',
  },
  {
    id: 'room-3',
    houseId: 'house-1',
    name: 'Twin Room',
    type: 'bedroom',
    capacity: 2,
    notes: 'Two single beds, great for kids',
  },
  {
    id: 'room-4',
    houseId: 'house-1',
    name: 'Living Area',
    type: 'living_room',
    capacity: 8,
    notes: 'Open plan with fireplace',
  },
];

// Sample Rooms for Mountain View Cabin
export const cabinRooms: Room[] = [
  {
    id: 'room-5',
    houseId: 'house-2',
    name: 'Main Bedroom',
    type: 'bedroom',
    capacity: 2,
    notes: 'Queen bed, wood-burning fireplace',
  },
  {
    id: 'room-6',
    houseId: 'house-2',
    name: 'Loft Space',
    type: 'bedroom',
    capacity: 4,
    notes: 'Two double futons, mountain view',
  },
  {
    id: 'room-7',
    houseId: 'house-2',
    name: 'Storage Shed',
    type: 'storage',
    capacity: 0,
    notes: 'Hiking and ski equipment stored here',
  },
];

// Sample Safety Info
const lakesideSafetyInfo: SafetyInfo = {
  emergencyContacts: [
    { id: 'ec-1', name: 'Emergency Services', phone: '911', type: 'emergency' },
    { id: 'ec-2', name: 'Sarah (Owner)', phone: '+1 555-0101', type: 'owner' },
    { id: 'ec-3', name: 'Lake Town Hospital', phone: '+1 555-1234', type: 'emergency' },
    { id: 'ec-4', name: 'Bob (Neighbor)', phone: '+1 555-0199', type: 'neighbor' },
  ],
  fireExtinguisherLocation: 'Kitchen - under the sink, and Garage - by the door',
  waterShutoff: 'Basement, northeast corner, red valve handle',
  electricMainSwitch: 'Garage, main breaker panel on west wall',
  gasShutoff: 'Outside by the meter, requires wrench',
  additionalInfo: 'First aid kit in master bathroom cabinet. Flashlights in kitchen drawer.',
};

const cabinSafetyInfo: SafetyInfo = {
  emergencyContacts: [
    { id: 'ec-5', name: 'Emergency Services', phone: '911', type: 'emergency' },
    { id: 'ec-6', name: 'Sarah (Owner)', phone: '+1 555-0101', type: 'owner' },
    { id: 'ec-7', name: 'Mountain Rescue', phone: '+1 555-7890', type: 'emergency' },
  ],
  fireExtinguisherLocation: 'By the fireplace in the main room',
  waterShutoff: 'Under the kitchen sink, blue valve',
  electricMainSwitch: 'Back porch, covered panel',
  additionalInfo: 'Satellite phone in emergency kit (hall closet) for cell dead zones. Bear spray in storage shed.',
};

// Sample Houses
export const sampleHouses: House[] = [
  {
    id: 'house-1',
    familyGroupId: 'property-1',
    name: 'Lakeside Retreat',
    address: '123 Lakefront Drive, Lake Town, CA 92000',
    nickname: 'The Lake House',
    photos: [],
    rules: [
      'No smoking inside or on deck',
      'Quiet hours from 10 PM to 8 AM',
      'No pets without prior approval',
      'Maximum occupancy: 6 guests',
      'No parties or events',
      'Lock all doors when leaving',
    ],
    rulesVersion: 1,
    rooms: lakesideRooms,
    defaultArrivalChecklist: createDefaultArrivalChecklist(),
    defaultDepartureChecklist: createDefaultDepartureChecklist(),
    defaultCleaningChecklist: createDefaultCleaningChecklist(),
    safetyInfo: lakesideSafetyInfo,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'house-2',
    familyGroupId: 'property-1',
    name: 'Mountain View Cabin',
    address: '456 Pine Ridge Road, Mountain View, CO 80000',
    nickname: 'The Cabin',
    photos: [],
    rules: [
      'Stack firewood after use',
      'Check for wildlife before leaving food out',
      'Winter: run water briefly daily to prevent freezing',
      'No smoking anywhere on property',
      'Secure all trash in bear-proof bins',
    ],
    rulesVersion: 1,
    rooms: cabinRooms,
    defaultArrivalChecklist: createDefaultArrivalChecklist(),
    defaultDepartureChecklist: createDefaultDepartureChecklist(),
    defaultCleaningChecklist: createDefaultCleaningChecklist(),
    safetyInfo: cabinSafetyInfo,
    createdAt: new Date('2024-02-15'),
  },
];

// Sample Property Group
export const sampleFamilyGroup: PropertyGroup = {
  id: 'property-1',
  name: 'Mitchell Rentals',
  members: sampleMembers,
  houses: ['house-1', 'house-2'],
  createdAt: new Date('2024-01-01'),
  inviteCode: 'MTCH2024',
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
    attendees: ['member-3'],
    guestEmail: 'emily@guest.com',
    roomAssignments: [
      { roomId: 'room-1', memberIds: ['member-3'], notes: '' },
    ],
    arrivalNotes: 'Late arrival expected around 6 PM',
    arrivalChecklist: createDefaultArrivalChecklist().map((item, i) => ({
      ...item,
      checked: i < 4,
      checkedBy: i < 4 ? 'member-3' : undefined,
    })),
    departureChecklist: createDefaultDepartureChecklist(),
    arrivalChecklistActive: true,
    departureChecklistActive: false,
    status: 'active',
    rulesAcknowledgments: [
      { memberId: 'member-3', rulesVersion: 1, acknowledgedAt: getDate(-3) },
    ],
    createdBy: 'member-1',
    createdAt: new Date('2024-11-01'),
    confirmedBy: 'member-1',
    confirmedAt: new Date('2024-11-02'),
    color: '#3B82F6',
  },
  {
    id: 'stay-2',
    houseId: 'house-1',
    startDate: getDate(7),
    endDate: getDate(10),
    attendees: ['member-4'],
    guestEmail: 'michael@guest.com',
    roomAssignments: [{ roomId: 'room-2', memberIds: ['member-4'], notes: 'Business trip' }],
    arrivalNotes: 'Will be working remotely, needs quiet space',
    arrivalChecklist: createDefaultArrivalChecklist(),
    departureChecklist: createDefaultDepartureChecklist(),
    arrivalChecklistActive: false,
    departureChecklistActive: false,
    status: 'confirmed',
    rulesAcknowledgments: [
      { memberId: 'member-4', rulesVersion: 1, acknowledgedAt: getDate(-1) },
    ],
    createdBy: 'member-1',
    createdAt: new Date('2024-11-10'),
    confirmedBy: 'member-1',
    confirmedAt: new Date('2024-11-11'),
    color: '#10B981',
  },
  {
    id: 'stay-3',
    houseId: 'house-2',
    startDate: getDate(14),
    endDate: getDate(21),
    attendees: [],
    guestEmail: 'newguest@email.com',
    roomAssignments: [],
    arrivalNotes: 'Ski vacation',
    arrivalChecklist: createDefaultArrivalChecklist(),
    departureChecklist: createDefaultDepartureChecklist(),
    arrivalChecklistActive: false,
    departureChecklistActive: false,
    status: 'requested',
    rulesAcknowledgments: [],
    createdBy: 'member-1',
    createdAt: new Date('2024-10-15'),
    color: '#8B5CF6',
  },
  {
    id: 'stay-4',
    houseId: 'house-1',
    startDate: getDate(-14),
    endDate: getDate(-10),
    attendees: ['member-4'],
    roomAssignments: [{ roomId: 'room-1', memberIds: ['member-4'] }],
    arrivalChecklist: createDefaultArrivalChecklist().map(item => ({ ...item, checked: true })),
    departureChecklist: createDefaultDepartureChecklist().map(item => ({ ...item, checked: true })),
    arrivalChecklistActive: false,
    departureChecklistActive: false,
    status: 'completed',
    rulesAcknowledgments: [
      { memberId: 'member-4', rulesVersion: 1, acknowledgedAt: getDate(-15) },
    ],
    summary: {
      completedArrivalTasks: 6,
      totalArrivalTasks: 6,
      completedDepartureTasks: 6,
      totalDepartureTasks: 6,
      issuesReported: [],
      notes: 'Great guest, left property in excellent condition.',
      generatedAt: getDate(-10),
    },
    createdBy: 'member-1',
    createdAt: new Date('2024-10-01'),
    confirmedBy: 'member-1',
    confirmedAt: new Date('2024-10-02'),
    color: '#F59E0B',
  },
];

// Sample Cleaning Tasks
export const sampleCleaningTasks: CleaningTask[] = [
  {
    id: 'clean-1',
    houseId: 'house-1',
    stayId: 'stay-4',
    assignedTo: 'member-5',
    checklist: createDefaultCleaningChecklist().map(item => ({ ...item, checked: true })),
    status: 'completed',
    issuesFound: [],
    createdAt: getDate(-10),
    completedAt: getDate(-9),
    notes: 'All done, restocked toiletries.',
  },
];

// Sample Board Posts (internal notes for owner/cohost)
export const sampleBoardPosts: BoardPost[] = [
  {
    id: 'post-1',
    houseId: 'house-1',
    authorId: 'member-1',
    content:
      'Reminder: The dock needs inspection before summer season. Schedule maintenance contractor.',
    isPinned: true,
    createdAt: getDate(-5),
  },
  {
    id: 'post-2',
    houseId: 'house-1',
    authorId: 'member-2',
    content:
      'Updated the WiFi password for the month. New password is in the welcome binder.',
    isPinned: false,
    createdAt: getDate(-3),
  },
  {
    id: 'post-3',
    houseId: 'house-2',
    authorId: 'member-1',
    content:
      'Fireplace inspection completed. All clear for the season.',
    isPinned: true,
    createdAt: getDate(-10),
  },
];

// Sample Shopping Items (standard supplies)
export const sampleShoppingItems: ShoppingItem[] = [
  {
    id: 'item-1',
    houseId: 'house-1',
    name: 'Toilet Paper (12-pack)',
    quantity: 2,
    priority: 'high',
    category: 'toiletries',
    addedBy: 'member-1',
    status: 'standard',
    isLowStock: true,
    createdAt: getDate(-2),
  },
  {
    id: 'item-2',
    houseId: 'house-1',
    name: 'Dish Soap',
    quantity: 1,
    priority: 'normal',
    category: 'cleaning',
    addedBy: 'member-1',
    status: 'standard',
    createdAt: getDate(-1),
  },
  {
    id: 'item-3',
    houseId: 'house-1',
    name: 'Coffee Pods',
    quantity: 2,
    priority: 'normal',
    category: 'food',
    addedBy: 'member-3',
    status: 'suggested',
    createdAt: getDate(-3),
  },
  {
    id: 'item-4',
    houseId: 'house-2',
    name: 'Firewood Bundle',
    quantity: 3,
    priority: 'high',
    category: 'maintenance',
    addedBy: 'member-1',
    status: 'standard',
    createdAt: getDate(-5),
  },
  {
    id: 'item-5',
    houseId: 'house-2',
    name: 'LED Light Bulbs',
    quantity: 4,
    priority: 'normal',
    category: 'maintenance',
    addedBy: 'member-2',
    status: 'standard',
    createdAt: getDate(-4),
  },
];

// Sample Issues
export const sampleIssues: Issue[] = [
  {
    id: 'issue-1',
    houseId: 'house-1',
    stayId: 'stay-1',
    roomId: 'room-3',
    title: 'Lamp not working',
    description: 'The bedside lamp in the twin room stopped working. Bulb replaced but still not working - may be electrical.',
    type: 'maintenance',
    severity: 'medium',
    photos: [],
    status: 'open',
    reportedBy: 'member-3',
    createdAt: getDate(-2),
  },
  {
    id: 'issue-2',
    houseId: 'house-1',
    title: 'Deck railing loose',
    description: 'The railing on the lake-facing side of the deck is wobbly. Safety concern.',
    type: 'safety',
    severity: 'high',
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
    description: 'The bathroom sink is draining slowly. Needs to be unclogged.',
    type: 'maintenance',
    severity: 'low',
    photos: [],
    status: 'in_progress',
    reportedBy: 'member-2',
    assignedTo: 'member-2',
    createdAt: getDate(-10),
  },
];

// Sample Notifications
export const sampleNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'stay_reminder',
    title: 'Guest Checkout Tomorrow',
    message: 'Emily Chen checks out from Lakeside Retreat tomorrow',
    houseId: 'house-1',
    stayId: 'stay-1',
    read: false,
    createdAt: getDate(-1),
    recipientRole: 'owner',
  },
  {
    id: 'notif-2',
    type: 'safety_issue',
    title: 'Safety Issue Reported',
    message: 'Deck railing loose at Lakeside Retreat - marked as safety concern',
    houseId: 'house-1',
    issueId: 'issue-2',
    read: false,
    createdAt: getDate(-7),
    recipientRole: 'owner',
  },
  {
    id: 'notif-3',
    type: 'stay_requested',
    title: 'New Stay Request',
    message: 'New stay requested for Mountain View Cabin (Dec 14-21)',
    houseId: 'house-2',
    stayId: 'stay-3',
    read: false,
    createdAt: getDate(-1),
    recipientRole: 'owner',
  },
  {
    id: 'notif-4',
    type: 'checklist_activated',
    title: 'Departure Checklist Active',
    message: 'Departure checklist is now active for current stay',
    houseId: 'house-1',
    stayId: 'stay-1',
    read: true,
    createdAt: getDate(0),
    recipientRole: 'guest',
  },
];

// Current user (Owner for demo)
export const currentUser = sampleMembers[0]; // Sarah Mitchell as owner
