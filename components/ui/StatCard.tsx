'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import Link from 'next/link';

interface StatCardProps {
  value: string | number;
  label?: string;
  title?: string; // Alias for label
  description?: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  change?: number;
  changeLabel?: string;
  trend?: { value: number; isPositive: boolean }; // Alternative to change
  sparkline?: number[];
  sparklineColor?: string;
  href?: string;
}

export function StatCard({
  value,
  label,
  title,
  description,
  icon,
  iconBgColor = 'bg-primary-100',
  iconColor = 'text-primary-600',
  change,
  changeLabel = 'Last month',
  trend,
  sparkline,
  sparklineColor = '#0ac5b3',
  href,
}: StatCardProps) {
  // Use title as alias for label
  const displayLabel = label || title || '';
  // Support both change and trend props
  const trendValue = change ?? trend?.value;
  const isPositive = trend ? trend.isPositive : (change !== undefined && change >= 0);

  const cardContent = (
    <div className={cn(
      "bg-white rounded-2xl p-5 border border-slate-100",
      href && "cursor-pointer hover:border-slate-200 hover:shadow-md transition-all"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-3xl font-bold text-slate-800">{value}</p>
          <p className="text-sm text-slate-500 mt-1">{displayLabel}</p>
          {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}

          {trendValue !== undefined && (
            <div className="flex items-center gap-2 mt-3">
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full',
                  isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                )}
              >
                {isPositive ? (
                  <FiTrendingUp className="w-3 h-3" />
                ) : (
                  <FiTrendingDown className="w-3 h-3" />
                )}
                {Math.abs(trendValue)}%
              </span>
              <span className="text-xs text-slate-400">{changeLabel}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <div
            className={cn(
              'w-11 h-11 rounded-xl flex items-center justify-center',
              iconBgColor,
              iconColor
            )}
          >
            {icon}
          </div>

          {/* Mini Sparkline */}
          {sparkline && sparkline.length > 0 && (
            <div className="flex items-end gap-0.5 h-8">
              {sparkline.map((value, index) => (
                <div
                  key={index}
                  className="w-1 rounded-sm"
                  style={{
                    height: `${Math.max(value * 100, 10)}%`,
                    backgroundColor: sparklineColor,
                    opacity: 0.4 + (index / sparkline.length) * 0.6,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{cardContent}</Link>;
  }

  return cardContent;
}
