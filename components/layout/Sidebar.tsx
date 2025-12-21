'use client';

import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiCalendar,
  FiMessageSquare,
  FiShoppingCart,
  FiAlertCircle,
  FiSettings,
  FiChevronDown,
  FiPlus,
} from 'react-icons/fi';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <FiHome className="w-5 h-5" /> },
  { label: 'Calendar', href: '/calendar', icon: <FiCalendar className="w-5 h-5" /> },
  { label: 'Board', href: '/board', icon: <FiMessageSquare className="w-5 h-5" /> },
  { label: 'Shopping', href: '/shopping', icon: <FiShoppingCart className="w-5 h-5" /> },
  { label: 'Issues', href: '/issues', icon: <FiAlertCircle className="w-5 h-5" /> },
  { label: 'Settings', href: '/settings', icon: <FiSettings className="w-5 h-5" /> },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { state, dispatch, getHouseById } = useApp();

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  const handleHouseChange = (houseId: string) => {
    dispatch({ type: 'SET_SELECTED_HOUSE', payload: houseId });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-4 py-5 border-b border-slate-100">
            <h1 className="text-xl font-bold text-slate-800">Home Planner</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {state.familyGroup?.name || 'Family'}
            </p>
          </div>

          {/* House Selector */}
          <div className="px-3 py-3 border-b border-slate-100">
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider px-1 mb-2 block">
              House
            </label>
            <div className="relative">
              <select
                value={state.selectedHouseId || ''}
                onChange={(e) => handleHouseChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                {state.houses.map((house) => (
                  <option key={house.id} value={house.id}>
                    {house.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <Link
              href="/houses"
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 mt-2 px-1"
            >
              <FiPlus className="w-3 h-3" />
              Manage houses
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => onClose()}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-slate-800 text-white'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User */}
          {state.currentUser && (
            <div className="px-3 py-4 border-t border-slate-100">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-sm font-medium">
                  {state.currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {state.currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">
                    {state.currentUser.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
