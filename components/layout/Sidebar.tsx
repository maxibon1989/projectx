'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import {
  FiHome,
  FiClipboard,
  FiLayers,
  FiAward,
  FiUsers,
  FiCheckSquare,
  FiMessageCircle,
  FiFileText,
  FiActivity,
  FiLink,
  FiSettings,
  FiCreditCard,
  FiShield,
  FiSliders,
  FiChevronLeft,
  FiChevronDown,
} from 'react-icons/fi';
import { CompanyRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: CompanyRole[];
  badge?: number;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'company' | 'employee';
}

export function Sidebar({ isOpen, onClose, variant = 'company' }: SidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const companyId = (params.companyId as string) || 'demo';
  const employeeId = (params.employeeId as string) || 'me';

  // Company Workspace navigation
  const companyNavItems: NavItem[] = [
    {
      label: 'Home',
      href: `/company/${companyId}/home`,
      icon: <FiHome className="w-5 h-5" />,
    },
    {
      label: 'Audit',
      href: `/company/${companyId}/audit`,
      icon: <FiClipboard className="w-5 h-5" />,
    },
    {
      label: 'Plan',
      href: `/company/${companyId}/plan`,
      icon: <FiLayers className="w-5 h-5" />,
    },
    {
      label: 'Certificate',
      href: `/company/${companyId}/certificate`,
      icon: <FiAward className="w-5 h-5" />,
    },
    {
      label: 'Employees',
      href: `/company/${companyId}/employees`,
      icon: <FiUsers className="w-5 h-5" />,
    },
    {
      label: 'Operations',
      href: '/ops/tasks',
      icon: <FiCheckSquare className="w-5 h-5" />,
      badge: 2,
    },
    {
      label: 'Support',
      href: '/support/tickets',
      icon: <FiMessageCircle className="w-5 h-5" />,
      badge: 1,
    },
    {
      label: 'Documents',
      href: '/docs',
      icon: <FiFileText className="w-5 h-5" />,
    },
  ];

  const companySecondaryItems: NavItem[] = [
    {
      label: 'Monitoring',
      href: `/company/${companyId}/monitoring`,
      icon: <FiActivity className="w-5 h-5" />,
    },
    {
      label: 'Integrations',
      href: `/company/${companyId}/integrations`,
      icon: <FiLink className="w-5 h-5" />,
    },
    {
      label: 'Settings',
      href: `/company/${companyId}/settings`,
      icon: <FiSettings className="w-5 h-5" />,
    },
    {
      label: 'Billing',
      href: `/company/${companyId}/billing`,
      icon: <FiCreditCard className="w-5 h-5" />,
    },
  ];

  // Employee Wallet navigation
  const employeeNavItems: NavItem[] = [
    {
      label: 'My Security',
      href: `/employee/${employeeId}/security`,
      icon: <FiShield className="w-5 h-5" />,
    },
    {
      label: 'My Choices',
      href: `/employee/${employeeId}/choices`,
      icon: <FiSliders className="w-5 h-5" />,
    },
    {
      label: 'Support',
      href: '/support/tickets',
      icon: <FiMessageCircle className="w-5 h-5" />,
    },
    {
      label: 'Documents',
      href: '/docs',
      icon: <FiFileText className="w-5 h-5" />,
    },
  ];

  const navItems = variant === 'employee' ? employeeNavItems : companyNavItems;
  const secondaryItems = variant === 'employee' ? [] : companySecondaryItems;

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname.startsWith(href);
  };

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
          'fixed left-0 top-0 h-full w-64 bg-white z-50 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col shadow-lg',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo Header */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="text-lg font-bold text-slate-800">Unbound</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
          >
            <FiChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Selector */}
        <div className="px-4 py-3">
          <div className="relative">
            <select
              value={variant}
              onChange={() => {}}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="company">Company Workspace</option>
              <option value="employee">Employee Wallet</option>
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  onClick={() => onClose()}
                  className={cn(
                    'flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive(item.href)
                      ? 'bg-primary text-white shadow-sm'
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
                        isActive(item.href)
                          ? 'bg-white/20 text-white'
                          : 'bg-rose-100 text-rose-600'
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Secondary Navigation */}
          {secondaryItems.length > 0 && (
            <>
              <div className="my-4 border-t border-slate-100" />
              <ul className="space-y-1">
                {secondaryItems.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      onClick={() => onClose()}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                        isActive(item.href)
                          ? 'bg-primary text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </nav>

        {/* Company Info */}
        {variant === 'company' && (
          <div className="px-4 pb-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <h4 className="font-semibold text-slate-800 text-sm">Acme AB</h4>
              <p className="text-xs text-slate-500 mt-1">52 employees</p>
              <div className="flex gap-2 mt-3">
                <span className="flex-1 text-center px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg">
                  Plan Drafted
                </span>
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className="px-4 py-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
              AJ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">Anna Johansson</p>
              <p className="text-xs text-slate-500">CEO</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
