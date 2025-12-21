'use client';

import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Badge, Avatar, AvatarGroup, EmptyState } from '@/components/ui';
import { formatDate, formatDateRange, formatRelativeTime, getDaysBetween } from '@/lib/utils';
import Link from 'next/link';
import {
  FiCalendar,
  FiMessageSquare,
  FiShoppingCart,
  FiAlertCircle,
  FiHome,
  FiChevronRight,
  FiCheckCircle,
} from 'react-icons/fi';

export default function Dashboard() {
  const {
    state,
    getHouseById,
    getActiveStay,
    getUpcomingStays,
    getBoardPostsForHouse,
    getShoppingItemsForHouse,
    getIssuesForHouse,
    getMemberById,
  } = useApp();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  if (!selectedHouse) {
    return (
      <PageLayout title="Dashboard">
        <EmptyState
          icon={<FiHome className="w-8 h-8" />}
          title="No house selected"
          description="Select a house from the sidebar or add a new one to get started."
          actionLabel="Add House"
          onAction={() => {}}
        />
      </PageLayout>
    );
  }

  const activeStay = getActiveStay(selectedHouse.id);
  const upcomingStays = getUpcomingStays(selectedHouse.id).slice(0, 3);
  const boardPosts = getBoardPostsForHouse(selectedHouse.id).slice(0, 3);
  const shoppingItems = getShoppingItemsForHouse(selectedHouse.id).slice(0, 5);
  const issues = getIssuesForHouse(selectedHouse.id).filter((i) => i.status !== 'fixed').slice(0, 3);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
      active: 'success',
      planned: 'info',
      open: 'danger',
      in_progress: 'warning',
      fixed: 'success',
    };
    return variants[status] || 'default';
  };

  return (
    <PageLayout title={selectedHouse.name}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Active Stay Banner */}
        {activeStay && (
          <Card className="bg-gradient-to-r from-slate-800 to-slate-700 border-0">
            <CardBody className="p-5">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="success" size="sm">
                      Active Stay
                    </Badge>
                  </div>
                  <h2 className="text-lg font-semibold mb-1">
                    {formatDateRange(activeStay.startDate, activeStay.endDate)}
                  </h2>
                  <p className="text-slate-300 text-sm">
                    {getDaysBetween(new Date(), activeStay.endDate)} days remaining
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Attendees</p>
                    <AvatarGroup
                      members={activeStay.attendees
                        .map((id) => getMemberById(id))
                        .filter(Boolean)
                        .map((m) => ({ name: m!.name }))}
                      max={4}
                      size="sm"
                    />
                  </div>
                  <Link
                    href={`/calendar?stay=${activeStay.id}`}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/calendar">
            <Card hover className="h-full">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {upcomingStays.length}
                    </p>
                    <p className="text-xs text-slate-500">Upcoming stays</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/board">
            <Card hover className="h-full">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                    <FiMessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {boardPosts.length}
                    </p>
                    <p className="text-xs text-slate-500">Board posts</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/shopping">
            <Card hover className="h-full">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                    <FiShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {shoppingItems.length}
                    </p>
                    <p className="text-xs text-slate-500">Shopping items</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>

          <Link href="/issues">
            <Card hover className="h-full">
              <CardBody className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                    <FiAlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">
                      {issues.length}
                    </p>
                    <p className="text-xs text-slate-500">Open issues</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Upcoming Stays */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Upcoming Stays</h3>
                <Link
                  href="/calendar"
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  View all <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {upcomingStays.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-500">No upcoming stays scheduled</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {upcomingStays.map((stay) => (
                    <li key={stay.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-1 h-12 rounded-full"
                            style={{ backgroundColor: stay.color || '#3B82F6' }}
                          />
                          <div>
                            <p className="font-medium text-slate-800">
                              {formatDateRange(stay.startDate, stay.endDate)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <AvatarGroup
                                members={stay.attendees
                                  .map((id) => getMemberById(id))
                                  .filter(Boolean)
                                  .map((m) => ({ name: m!.name }))}
                                max={3}
                                size="sm"
                              />
                              <span className="text-xs text-slate-500">
                                {stay.attendees.length} {stay.attendees.length === 1 ? 'person' : 'people'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={getStatusBadge(stay.status)}>
                          {stay.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Board Posts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Family Board</h3>
                <Link
                  href="/board"
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  View all <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {boardPosts.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-500">No posts yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {boardPosts.map((post) => {
                    const author = getMemberById(post.authorId);
                    return (
                      <li key={post.id} className="p-4">
                        <div className="flex gap-3">
                          <Avatar name={author?.name || 'Unknown'} size="sm" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-slate-800">
                                {author?.name || 'Unknown'}
                              </span>
                              {post.isPinned && (
                                <Badge variant="warning" size="sm">
                                  Pinned
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 mt-0.5 line-clamp-2">
                              {post.content}
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              {formatRelativeTime(post.createdAt)}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Shopping List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Shopping List</h3>
                <Link
                  href="/shopping"
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  View all <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {shoppingItems.length === 0 ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-slate-500">Shopping list is empty</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {shoppingItems.map((item) => (
                    <li
                      key={item.id}
                      className={`p-4 priority-${item.priority}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-800">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Qty: {item.quantity} · {item.category}
                          </p>
                        </div>
                        <Badge
                          variant={
                            item.priority === 'urgent'
                              ? 'danger'
                              : item.priority === 'high'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {item.priority}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          {/* Issues */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-800">Open Issues</h3>
                <Link
                  href="/issues"
                  className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                >
                  View all <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {issues.length === 0 ? (
                <div className="p-4 text-center">
                  <FiCheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">No open issues</p>
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {issues.map((issue) => {
                    const reporter = getMemberById(issue.reportedBy);
                    const room = selectedHouse.rooms.find((r) => r.id === issue.roomId);
                    return (
                      <li
                        key={issue.id}
                        className={`p-4 border-l-2 status-${issue.status}`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-800">{issue.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {room ? `${room.name} · ` : ''}
                              Reported by {reporter?.name || 'Unknown'}
                            </p>
                          </div>
                          <Badge variant={getStatusBadge(issue.status)} size="sm">
                            {issue.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>

        {/* House Rules */}
        {selectedHouse.rules.length > 0 && (
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-800">House Rules</h3>
            </CardHeader>
            <CardBody>
              <ul className="grid md:grid-cols-2 gap-2">
                {selectedHouse.rules.map((rule, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-medium text-slate-500">
                      {index + 1}
                    </span>
                    {rule}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
