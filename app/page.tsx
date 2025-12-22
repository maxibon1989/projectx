'use client';

import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Badge, Avatar, AvatarGroup, EmptyState, Button, StatCard } from '@/components/ui';
import { formatDateRange, formatRelativeTime, getDaysBetween } from '@/lib/utils';
import Link from 'next/link';
import {
  FiCalendar,
  FiMessageSquare,
  FiShoppingCart,
  FiAlertCircle,
  FiHome,
  FiChevronRight,
  FiCheckCircle,
  FiUsers,
  FiPlus,
  FiDownload,
  FiEye,
  FiMapPin,
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
    getStaysForHouse,
  } = useApp();

  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
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
      <PageLayout>
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
  const allStays = getStaysForHouse(selectedHouse.id);
  const upcomingStays = getUpcomingStays(selectedHouse.id).slice(0, 3);
  const boardPosts = getBoardPostsForHouse(selectedHouse.id).slice(0, 3);
  const shoppingItems = getShoppingItemsForHouse(selectedHouse.id).slice(0, 5);
  const issues = getIssuesForHouse(selectedHouse.id).filter((i) => i.status !== 'fixed').slice(0, 3);
  const completedStays = allStays.filter((s) => s.status === 'completed').length;

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
    <PageLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
            <p className="text-slate-500 text-sm mt-1">{selectedHouse.name} · {selectedHouse.nickname || selectedHouse.address}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <FiDownload className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link href="/calendar">
              <Button size="sm">
                <FiPlus className="w-4 h-4 mr-2" />
                Plan Stay
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            value={allStays.length}
            label="Total Stays"
            icon={<FiCalendar className="w-5 h-5" />}
            iconBgColor="bg-primary-100"
            iconColor="text-primary-600"
            change={12}
            sparkline={[0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.9]}
            sparklineColor="#0ac5b3"
          />
          <StatCard
            value={state.familyGroup?.members.length || 0}
            label="Family Members"
            icon={<FiUsers className="w-5 h-5" />}
            iconBgColor="bg-blue-100"
            iconColor="text-blue-600"
            sparkline={[0.5, 0.6, 0.5, 0.7, 0.8, 0.7, 0.9]}
            sparklineColor="#3b82f6"
          />
          <StatCard
            value={completedStays}
            label="Completed Stays"
            icon={<FiCheckCircle className="w-5 h-5" />}
            iconBgColor="bg-amber-100"
            iconColor="text-amber-600"
            change={8}
            sparkline={[0.2, 0.4, 0.3, 0.5, 0.6, 0.7, 0.8]}
            sparklineColor="#f59e0b"
          />
          <StatCard
            value={issues.length}
            label="Open Issues"
            icon={<FiAlertCircle className="w-5 h-5" />}
            iconBgColor="bg-rose-100"
            iconColor="text-rose-600"
            change={issues.length > 0 ? -5 : 0}
            sparkline={[0.8, 0.6, 0.7, 0.5, 0.4, 0.3, 0.2]}
            sparklineColor="#f43f5e"
          />
        </div>

        {/* Active Stay Banner */}
        {activeStay && (
          <Card className="bg-gradient-to-r from-primary-600 to-primary-500 border-0 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardBody className="p-6 relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium">
                      Active Stay
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-1">
                    {formatDateRange(activeStay.startDate, activeStay.endDate)}
                  </h2>
                  <p className="text-primary-100 text-sm">
                    {getDaysBetween(new Date(), activeStay.endDate)} days remaining · {activeStay.attendees.length} attendees
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <AvatarGroup
                    members={activeStay.attendees
                      .map((id) => getMemberById(id))
                      .filter(Boolean)
                      .map((m) => ({ name: m!.name }))}
                    max={4}
                    size="md"
                  />
                  <Link
                    href={`/calendar?stay=${activeStay.id}`}
                    className="px-4 py-2.5 bg-white text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Stays & Board */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Stays */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Upcoming Stays</h3>
                  <Link
                    href="/calendar"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                  >
                    View all <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {upcomingStays.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiCalendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No upcoming stays scheduled</p>
                    <Link href="/calendar">
                      <Button variant="outline" size="sm" className="mt-3">
                        Plan a Stay
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {upcomingStays.map((stay) => (
                      <li key={stay.id} className="p-4 hover:bg-slate-50/50 transition-colors">
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
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                  >
                    View all <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {boardPosts.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiMessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">No posts yet</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {boardPosts.map((post) => {
                      const author = getMemberById(post.authorId);
                      return (
                        <li key={post.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex gap-3">
                            <Avatar name={author?.name || 'Unknown'} size="md" />
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
                                <span className="text-xs text-slate-400 ml-auto">
                                  {formatRelativeTime(post.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                                {post.content}
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
          </div>

          {/* Right Column - Shopping & Issues */}
          <div className="space-y-6">
            {/* Shopping List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">Shopping List</h3>
                  <Link
                    href="/shopping"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                  >
                    View all <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {shoppingItems.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiShoppingCart className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Shopping list is empty</p>
                  </div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {shoppingItems.map((item) => (
                      <li
                        key={item.id}
                        className={`p-4 priority-${item.priority} hover:bg-slate-50/50 transition-colors`}
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
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                  >
                    View all <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                {issues.length === 0 ? (
                  <div className="p-6 text-center">
                    <FiCheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
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
                          className="p-4 hover:bg-slate-50/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-slate-800">{issue.title}</p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                {room ? `${room.name} · ` : ''}
                                {reporter?.name || 'Unknown'}
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
        </div>

        {/* Explore Your Houses */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Explore Your Houses</h3>
            <Link
              href="/houses"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
            >
              Manage Houses <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {state.houses.map((house) => {
              const houseStays = getStaysForHouse(house.id);
              const isSelected = house.id === state.selectedHouseId;
              return (
                <Card
                  key={house.id}
                  hover
                  className={isSelected ? 'ring-2 ring-primary-500' : ''}
                  onClick={() => {}}
                >
                  <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
                    <FiHome className="w-12 h-12 text-slate-300" />
                    {isSelected && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-primary-500 text-white text-xs font-medium rounded-lg flex items-center gap-1">
                          <FiEye className="w-3 h-3" />
                          Selected
                        </span>
                      </div>
                    )}
                  </div>
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-slate-800">{house.name}</h4>
                        {house.address && (
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <FiMapPin className="w-3 h-3" />
                            {house.address.split(',')[0]}
                          </p>
                        )}
                      </div>
                      <span className="text-lg font-bold text-primary-600">
                        {house.rooms.length}
                        <span className="text-xs font-normal text-slate-400 ml-0.5">rooms</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {houseStays.length} stays
                      </span>
                      <span className="flex items-center gap-1">
                        <FiUsers className="w-3 h-3" />
                        {house.rooms.reduce((acc, r) => acc + r.capacity, 0)} capacity
                      </span>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
