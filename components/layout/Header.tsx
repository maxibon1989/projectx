'use client';

import { useApp } from '@/contexts/AppContext';
import { FiMenu, FiBell, FiSearch, FiSettings, FiCalendar, FiChevronDown } from 'react-icons/fi';
import { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { state, dispatch, getUnreadNotificationsCount } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = getUnreadNotificationsCount();
  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const handleNotificationClick = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-50/80 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 md:px-6 py-3">
        {/* Left: Menu + Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-slate-600 hover:bg-white hover:shadow-sm lg:hidden transition-all"
          >
            <FiMenu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Date Picker (decorative) */}
          <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50">
            <FiCalendar className="w-4 h-4 text-slate-400" />
            <span>{today}</span>
            <FiChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="overflow-y-auto max-h-72">
                    {state.notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">
                        No notifications
                      </div>
                    ) : (
                      state.notifications.slice(0, 10).map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification.id)}
                          className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${
                            !notification.read ? 'bg-primary-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                notification.read ? 'bg-transparent' : 'bg-primary-500'
                              }`}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800">
                                {notification.title}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {notification.message}
                              </p>
                              <p className="text-xs text-slate-400 mt-1">
                                {formatRelativeTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Settings */}
          <button className="p-2.5 rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors">
            <FiSettings className="w-5 h-5" />
          </button>

          {/* User Avatar */}
          {state.currentUser && (
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-white shadow-sm">
              {state.currentUser.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
