'use client';

import { cn, getRoleDisplayName } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiClipboard,
  FiShoppingCart,
  FiAlertCircle,
  FiSettings,
  FiChevronDown,
  FiChevronLeft,
  FiShield,
  FiBookOpen,
  FiCheckSquare,
  FiUsers,
  FiInfo,
} from 'react-icons/fi';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[]; // Which roles can see this item
  badge?: number;
}

// Navigation items with role-based visibility
const getNavItems = (
  requestedStaysCount: number,
  openIssuesCount: number,
  pendingCleaningCount: number
): NavItem[] => [
  // Owner and Co-host navigation
  {
    label: 'Dashboard',
    href: '/',
    icon: <FiHome className="w-5 h-5" />,
    roles: ['owner', 'cohost'],
  },
  {
    label: 'Calendar',
    href: '/calendar',
    icon: <FiCalendar className="w-5 h-5" />,
    roles: ['owner', 'cohost'],
  },
  {
    label: 'Stays',
    href: '/stays',
    icon: <FiClipboard className="w-5 h-5" />,
    roles: ['owner', 'cohost'],
    badge: requestedStaysCount > 0 ? requestedStaysCount : undefined,
  },
  {
    label: 'Issues',
    href: '/issues',
    icon: <FiAlertCircle className="w-5 h-5" />,
    roles: ['owner', 'cohost'],
    badge: openIssuesCount > 0 ? openIssuesCount : undefined,
  },
  {
    label: 'Shopping',
    href: '/shopping',
    icon: <FiShoppingCart className="w-5 h-5" />,
    roles: ['owner', 'cohost'],
  },
  {
    label: 'Cleaning',
    href: '/cleaning',
    icon: <FiCheckSquare className="w-5 h-5" />,
    roles: ['owner', 'cohost'],
    badge: pendingCleaningCount > 0 ? pendingCleaningCount : undefined,
  },
  {
    label: 'House Setup',
    href: '/houses',
    icon: <FiSettings className="w-5 h-5" />,
    roles: ['owner'],
  },

  // Guest navigation
  {
    label: 'My Stay',
    href: '/',
    icon: <FiHome className="w-5 h-5" />,
    roles: ['guest'],
  },
  {
    label: 'Checklist',
    href: '/checklist',
    icon: <FiCheckSquare className="w-5 h-5" />,
    roles: ['guest'],
  },
  {
    label: 'House Info',
    href: '/house-info',
    icon: <FiInfo className="w-5 h-5" />,
    roles: ['guest'],
  },
  {
    label: 'Report Issue',
    href: '/report-issue',
    icon: <FiAlertCircle className="w-5 h-5" />,
    roles: ['guest'],
  },

  // Cleaner navigation
  {
    label: 'Cleaning Tasks',
    href: '/cleaning',
    icon: <FiCheckSquare className="w-5 h-5" />,
    roles: ['cleaner'],
    badge: pendingCleaningCount > 0 ? pendingCleaningCount : undefined,
  },
];

// Safety item - always visible for all roles
const safetyItem: NavItem = {
  label: 'Safety Info',
  href: '/safety',
  icon: <FiShield className="w-5 h-5" />,
  roles: ['owner', 'cohost', 'guest', 'cleaner'],
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const {
    state,
    dispatch,
    getHouseById,
    getRequestedStays,
    getOpenIssuesForHouse,
    getPendingCleaningTasks,
    isOwner,
    isGuest,
    isCleaner,
  } = useApp();

  const userRole = state.currentUser?.role;

  // Get counts for badges
  const selectedHouseId = state.selectedHouseId;
  const requestedStaysCount = selectedHouseId ? getRequestedStays(selectedHouseId).length : 0;
  const openIssuesCount = selectedHouseId ? getOpenIssuesForHouse(selectedHouseId).length : 0;
  const pendingCleaningCount = getPendingCleaningTasks().length;

  // Filter nav items based on user role
  const navItems = getNavItems(requestedStaysCount, openIssuesCount, pendingCleaningCount).filter(
    (item) => userRole && item.roles.includes(userRole)
  );

  const handleHouseChange = (houseId: string) => {
    dispatch({ type: 'SET_SELECTED_HOUSE', payload: houseId });
  };

  // Show house selector only for owner/cohost
  const showHouseSelector = isOwner() || state.currentUser?.role === 'cohost';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <FiHome className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-slate-800">RentalOS</span>
          </div>
          <button
            onClick={onClose}
            className="lg:flex hidden w-7 h-7 rounded-lg bg-slate-100 items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* House Selector - Only for owner/cohost */}
        {showHouseSelector && (
          <div className="px-4 py-3">
            <div className="relative">
              <select
                value={state.selectedHouseId || ''}
                onChange={(e) => handleHouseChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                {state.houses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        {/* Guest/Cleaner Property Info */}
        {(isGuest() || isCleaner()) && state.selectedHouseId && (
          <div className="px-4 py-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <p className="text-sm font-medium text-slate-700">
                {getHouseById(state.selectedHouseId)?.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {getHouseById(state.selectedHouseId)?.address?.split(',')[0]}
              </p>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <li key={item.href + item.label}>
                  <Link
                    href={item.href}
                    onClick={() => onClose()}
                    className={cn(
                      'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      isActive
                        ? 'bg-primary-500 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </div>
                    {item.badge && (
                      <span
                        className={cn(
                          'px-2 py-0.5 text-xs font-semibold rounded-full',
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-rose-100 text-rose-600'
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Divider */}
          <div className="my-4 border-t border-slate-100" />

          {/* Safety - Always visible */}
          <ul className="space-y-1">
            <li>
              <Link
                href={safetyItem.href}
                onClick={() => onClose()}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                  pathname === safetyItem.href
                    ? 'bg-primary-500 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                )}
              >
                {safetyItem.icon}
                {safetyItem.label}
              </Link>
            </li>
            {/* Settings - Owner/Co-host only */}
            {(isOwner() || state.currentUser?.role === 'cohost') && (
              <li>
                <Link
                  href="/settings"
                  onClick={() => onClose()}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    pathname === '/settings'
                      ? 'bg-primary-500 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  )}
                >
                  <FiUsers className="w-5 h-5" />
                  Team
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Property Info Card - Owner only */}
        {isOwner() && (
          <div className="px-4 pb-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h4 className="font-semibold text-slate-800 text-sm">
                {state.familyGroup?.name || 'Property Group'}
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                {state.familyGroup?.members.length || 0} members · {state.houses.length} properties
              </p>
              <div className="flex gap-2 mt-3">
                <Link
                  href="/settings"
                  className="flex-1 text-center px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                >
                  Manage Team
                </Link>
                <Link
                  href="/houses"
                  className="flex-1 text-center px-3 py-2 text-xs font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-600"
                >
                  Add Property
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        {state.currentUser && (
          <div className="px-4 py-3 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                {state.currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {state.currentUser.name}
                </p>
                <p className="text-xs text-slate-500">
                  {getRoleDisplayName(state.currentUser.role)}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
