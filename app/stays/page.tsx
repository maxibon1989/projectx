'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Badge, Button, EmptyState, AvatarGroup, Modal, Input, Select } from '@/components/ui';
import { formatDateRange, formatRelativeTime, getStayStatusDisplay, getDaysBetween } from '@/lib/utils';
import Link from 'next/link';
import {
  FiCalendar,
  FiPlus,
  FiChevronRight,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiFilter,
  FiX,
  FiClipboard,
} from 'react-icons/fi';
import { StayStatus } from '@/types';

export default function StaysPage() {
  const {
    state,
    getHouseById,
    getStaysForHouse,
    getRequestedStays,
    getUpcomingStays,
    getMemberById,
    confirmStay,
    dispatch,
    isOwner,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<StayStatus | 'all'>('all');

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  if (!selectedHouse) {
    return (
      <PageLayout>
        <EmptyState
          icon={<FiCalendar className="w-8 h-8" />}
          title="No property selected"
          description="Select a property to view stays."
        />
      </PageLayout>
    );
  }

  const allStays = getStaysForHouse(selectedHouse.id);
  const requestedStays = getRequestedStays(selectedHouse.id);

  const filteredStays = statusFilter === 'all'
    ? allStays
    : allStays.filter((s) => s.status === statusFilter);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
      requested: 'warning',
      planned: 'info',
      confirmed: 'success',
      active: 'success',
      completed: 'neutral',
      cancelled: 'danger',
    };
    return variants[status] || 'default';
  };

  const handleDecline = (stayId: string) => {
    dispatch({
      type: 'UPDATE_STAY',
      payload: {
        ...state.stays.find((s) => s.id === stayId)!,
        status: 'cancelled',
      },
    });
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Stays</h1>
            <p className="text-slate-500 text-sm mt-1">{selectedHouse.name} · {allStays.length} total stays</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StayStatus | 'all')}
                className="appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              >
                <option value="all">All Statuses</option>
                <option value="requested">Requested</option>
                <option value="planned">Planned</option>
                <option value="confirmed">Confirmed</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
            <Link href="/calendar">
              <Button size="sm">
                <FiPlus className="w-4 h-4 mr-2" />
                New Stay
              </Button>
            </Link>
          </div>
        </div>

        {/* Pending Requests */}
        {requestedStays.length > 0 && statusFilter === 'all' && (
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiClock className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold text-slate-800">Pending Requests ({requestedStays.length})</h2>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <ul className="divide-y divide-amber-200/50">
                {requestedStays.map((stay) => (
                  <li key={stay.id} className="p-4 hover:bg-amber-50/50 transition-colors">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-14 rounded-full bg-amber-400" />
                        <div>
                          <p className="font-medium text-slate-800">
                            {formatDateRange(stay.startDate, stay.endDate)}
                          </p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {stay.guestEmail || 'Guest'} · {getDaysBetween(stay.startDate, stay.endDate)} nights
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Requested {formatRelativeTime(stay.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDecline(stay.id)}
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => confirmStay(stay.id)}
                        >
                          Confirm
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}

        {/* All Stays */}
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-slate-800">
              {statusFilter === 'all' ? 'All Stays' : `${getStayStatusDisplay(statusFilter)} Stays`}
            </h2>
          </CardHeader>
          <CardBody className="p-0">
            {filteredStays.length === 0 ? (
              <div className="p-8 text-center">
                <FiCalendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-1">No stays found</h3>
                <p className="text-sm text-slate-500">
                  {statusFilter === 'all'
                    ? 'Create your first stay to get started.'
                    : `No ${statusFilter} stays.`}
                </p>
                {statusFilter === 'all' && (
                  <Link href="/calendar">
                    <Button variant="outline" size="sm" className="mt-4">
                      Create Stay
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {filteredStays
                  .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                  .map((stay) => {
                    const guests = stay.attendees.map((id) => getMemberById(id)).filter(Boolean);
                    return (
                      <li key={stay.id}>
                        <Link
                          href={`/stays/${stay.id}`}
                          className="block p-4 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-1.5 h-14 rounded-full"
                                style={{ backgroundColor: stay.color || '#0ac5b3' }}
                              />
                              <div>
                                <p className="font-medium text-slate-800">
                                  {formatDateRange(stay.startDate, stay.endDate)}
                                </p>
                                <div className="flex items-center gap-3 mt-1.5">
                                  {guests.length > 0 ? (
                                    <AvatarGroup
                                      members={guests.map((g) => ({ name: g!.name }))}
                                      max={3}
                                      size="sm"
                                    />
                                  ) : (
                                    <span className="text-xs text-slate-400">
                                      {stay.guestEmail || 'No guests assigned'}
                                    </span>
                                  )}
                                  <span className="text-xs text-slate-500">
                                    {getDaysBetween(stay.startDate, stay.endDate)} nights
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={getStatusBadge(stay.status)}>
                                {getStayStatusDisplay(stay.status)}
                              </Badge>
                              <FiChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </div>

                          {/* Summary for completed stays */}
                          {stay.status === 'completed' && stay.summary && (
                            <div className="mt-3 ml-5 pl-4 border-l-2 border-slate-200">
                              <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <FiCheckCircle className="w-3.5 h-3.5 text-green-500" />
                                  Arrival: {stay.summary.completedArrivalTasks}/{stay.summary.totalArrivalTasks}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiCheckCircle className="w-3.5 h-3.5 text-green-500" />
                                  Departure: {stay.summary.completedDepartureTasks}/{stay.summary.totalDepartureTasks}
                                </span>
                                {stay.summary.issuesReported.length > 0 && (
                                  <span className="flex items-center gap-1 text-amber-600">
                                    <FiClipboard className="w-3.5 h-3.5" />
                                    {stay.summary.issuesReported.length} issues reported
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>
    </PageLayout>
  );
}
