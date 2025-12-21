'use client';

import { useApp } from '@/contexts/AppContext';
import { FiMenu, FiBell } from 'react-icons/fi';
import { useState } from 'react';
import { formatRelativeTime } from '@/lib/utils';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

export function Header({ onMenuClick, title }: HeaderProps) {
  const { state, dispatch, getUnreadNotificationsCount, getHouseById, getMemberById } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = getUnreadNotificationsCount();

  const handleMarkAllRead = () => {
    dispatch({ type: 'MARK_ALL_NOTIFICATIONS_READ' });
  };

  const handleNotificationClick = (notificationId: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <FiMenu className="w-5 h-5" />
          </button>
          {title && (
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <FiBell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
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
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50 max-h-96 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs text-slate-500 hover:text-slate-700"
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
                          className={`px-4 py-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                                notification.read ? 'bg-transparent' : 'bg-blue-500'
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
        </div>
      </div>
    </header>
  );
}
