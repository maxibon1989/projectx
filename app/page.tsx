'use client';

import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Badge, Avatar, AvatarGroup, EmptyState, Button, StatCard } from '@/components/ui';
import { formatDateRange, formatRelativeTime, getDaysBetween, getStayStatusDisplay, getStayStatusColor, getIssueTypeDisplay } from '@/lib/utils';
import Link from 'next/link';
import {
  FiCalendar,
  FiClipboard,
  FiShoppingCart,
  FiAlertCircle,
  FiHome,
  FiChevronRight,
  FiCheckCircle,
  FiUsers,
  FiPlus,
  FiClock,
  FiMapPin,
  FiShield,
  FiCheckSquare,
  FiAlertTriangle,
} from 'react-icons/fi';

export default function Dashboard() {
  const {
    state,
    getHouseById,
    getActiveStay,
    getUpcomingStays,
    getRequestedStays,
    getShoppingItemsForHouse,
    getOpenIssuesForHouse,
    getSafetyIssuesForHouse,
    getCleaningTasksForHouse,
    getPendingCleaningTasks,
    getMemberById,
    getStaysForHouse,
    isOwner,
    isCohost,
    isGuest,
    isCleaner,
    confirmStay,
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
          title="No property selected"
          description="Select a property from the sidebar or add a new one to get started."
          actionLabel="Add Property"
          onAction={() => {}}
        />
      </PageLayout>
    );
  }

  const activeStay = getActiveStay(selectedHouse.id);
  const allStays = getStaysForHouse(selectedHouse.id);
  const upcomingStays = getUpcomingStays(selectedHouse.id).slice(0, 3);
  const requestedStays = getRequestedStays(selectedHouse.id);
  const shoppingItems = getShoppingItemsForHouse(selectedHouse.id).slice(0, 5);
  const openIssues = getOpenIssuesForHouse(selectedHouse.id);
  const safetyIssues = getSafetyIssuesForHouse(selectedHouse.id);
  const pendingCleaning = getPendingCleaningTasks();
  const completedStays = allStays.filter((s) => s.status === 'completed').length;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'neutral'> = {
      requested: 'warning',
      planned: 'info',
      confirmed: 'success',
      active: 'success',
      completed: 'neutral',
      cancelled: 'danger',
      open: 'danger',
      in_progress: 'warning',
      fixed: 'success',
    };
    return variants[status] || 'default';
  };

  // Owner/Co-host Dashboard
  if (isOwner() || isCohost()) {
    return (
      <PageLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Dashboard Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
              <p className="text-slate-500 text-sm mt-1">{selectedHouse.name} · {selectedHouse.nickname || selectedHouse.address?.split(',')[0]}</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/stays">
                <Button variant="outline" size="sm">
                  <FiClipboard className="w-4 h-4 mr-2" />
                  All Stays
                </Button>
              </Link>
              <Link href="/calendar">
                <Button size="sm">
                  <FiPlus className="w-4 h-4 mr-2" />
                  New Stay
                </Button>
              </Link>
            </div>
          </div>

          {/* Safety Alert Banner */}
          {safetyIssues.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
              <FiAlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-rose-800">Safety Issues Require Attention</h3>
                <p className="text-sm text-rose-600 mt-0.5">
                  {safetyIssues.length} safety {safetyIssues.length === 1 ? 'issue' : 'issues'} need to be addressed
                </p>
                <Link href="/issues" className="text-sm font-medium text-rose-700 hover:text-rose-800 mt-2 inline-block">
                  View Issues →
                </Link>
              </div>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              value={upcomingStays.length}
              label="Upcoming stays"
              icon={<FiCalendar className="w-5 h-5" />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              href="/calendar"
            />
            <StatCard
              value={requestedStays.length}
              label="Pending requests"
              icon={<FiClock className="w-5 h-5" />}
              iconBgColor={requestedStays.length > 0 ? "bg-amber-100" : "bg-slate-100"}
              iconColor={requestedStays.length > 0 ? "text-amber-600" : "text-slate-600"}
              href="/stays"
            />
            <StatCard
              value={openIssues.length}
              label="Open issues"
              icon={<FiAlertCircle className="w-5 h-5" />}
              iconBgColor={openIssues.length > 0 ? "bg-rose-100" : "bg-green-100"}
              iconColor={openIssues.length > 0 ? "text-rose-600" : "text-green-600"}
              href="/issues"
            />
            <StatCard
              value={pendingCleaning.length}
              label="Cleaning tasks"
              icon={<FiCheckSquare className="w-5 h-5" />}
              iconBgColor={pendingCleaning.length > 0 ? "bg-purple-100" : "bg-slate-100"}
              iconColor={pendingCleaning.length > 0 ? "text-purple-600" : "text-slate-600"}
              href="/cleaning"
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
                      {getDaysBetween(new Date(), activeStay.endDate)} days remaining · {activeStay.attendees.length} guest{activeStay.attendees.length !== 1 ? 's' : ''}
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
                      href={`/stays/${activeStay.id}`}
                      className="px-4 py-2.5 bg-white text-primary-600 rounded-xl text-sm font-medium hover:bg-primary-50 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Pending Requests */}
          {requestedStays.length > 0 && (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FiClock className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-slate-800">Pending Requests</h3>
                  </div>
                  <Link
                    href="/stays"
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                  >
                    View all <FiChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <ul className="divide-y divide-amber-200/50">
                  {requestedStays.slice(0, 3).map((stay) => (
                    <li key={stay.id} className="p-4 hover:bg-amber-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-1.5 h-14 rounded-full bg-amber-400"
                          />
                          <div>
                            <p className="font-medium text-slate-800">
                              {formatDateRange(stay.startDate, stay.endDate)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {stay.guestEmail || 'Guest'} · Requested {formatRelativeTime(stay.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {/* reject */}}
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

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Stays & Issues */}
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
                      View calendar <FiChevronRight className="w-4 h-4" />
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
                          Schedule a Stay
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
                                    {stay.attendees.length} guest{stay.attendees.length !== 1 ? 's' : ''}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Badge variant={getStatusBadge(stay.status)}>
                              {getStayStatusDisplay(stay.status)}
                            </Badge>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardBody>
              </Card>

              {/* Open Issues */}
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
                  {openIssues.length === 0 ? (
                    <div className="p-6 text-center">
                      <FiCheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">No open issues</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {openIssues.slice(0, 5).map((issue) => {
                        const reporter = getMemberById(issue.reportedBy);
                        const room = selectedHouse.rooms.find((r) => r.id === issue.roomId);
                        return (
                          <li
                            key={issue.id}
                            className="p-4 hover:bg-slate-50/50 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium text-slate-800">{issue.title}</p>
                                  {issue.type === 'safety' && (
                                    <FiShield className="w-4 h-4 text-rose-500" />
                                  )}
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {getIssueTypeDisplay(issue.type)} · {room ? `${room.name} · ` : ''}
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

            {/* Right Column - Shopping & House Status */}
            <div className="space-y-6">
              {/* House Status */}
              <Card>
                <CardHeader>
                  <h3 className="font-semibold text-slate-800">Property Status</h3>
                </CardHeader>
                <CardBody className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Current Status</span>
                    <Badge variant={activeStay ? 'success' : 'neutral'}>
                      {activeStay ? 'Occupied' : 'Vacant'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total Stays</span>
                    <span className="text-sm font-medium text-slate-800">{completedStays}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Rooms</span>
                    <span className="text-sm font-medium text-slate-800">{selectedHouse.rooms.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Capacity</span>
                    <span className="text-sm font-medium text-slate-800">
                      {selectedHouse.rooms.reduce((acc, r) => acc + r.capacity, 0)} guests
                    </span>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <Link href="/houses" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Manage Property →
                    </Link>
                  </div>
                </CardBody>
              </Card>

              {/* Shopping List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">Supplies Needed</h3>
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
                      <p className="text-sm text-slate-500">All stocked up</p>
                    </div>
                  ) : (
                    <ul className="divide-y divide-slate-100">
                      {shoppingItems.map((item) => (
                        <li
                          key={item.id}
                          className={`p-4 hover:bg-slate-50/50 transition-colors`}
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
            </div>
          </div>

          {/* Properties Overview */}
          {state.houses.length > 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">All Properties</h3>
                <Link
                  href="/houses"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium"
                >
                  Manage Properties <FiChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {state.houses.map((house) => {
                  const houseActiveStay = getActiveStay(house.id);
                  const isSelected = house.id === state.selectedHouseId;
                  return (
                    <Card
                      key={house.id}
                      hover
                      className={isSelected ? 'ring-2 ring-primary-500' : ''}
                    >
                      <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-2xl flex items-center justify-center relative overflow-hidden">
                        <FiHome className="w-12 h-12 text-slate-300" />
                        {houseActiveStay && (
                          <div className="absolute top-2 right-2">
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-lg">
                              Occupied
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
                            {getStaysForHouse(house.id).length} stays
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
          )}
        </div>
      </PageLayout>
    );
  }

  // Guest Dashboard - Show "My Stay" view
  if (isGuest()) {
    const guestStay = state.stays.find(
      (s) => s.attendees.includes(state.currentUser!.id) && (s.status === 'active' || s.status === 'confirmed')
    );

    if (!guestStay) {
      return (
        <PageLayout>
          <div className="max-w-2xl mx-auto text-center py-12">
            <FiHome className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome</h1>
            <p className="text-slate-500">No active stay found. Check your invite link or contact the host.</p>
          </div>
        </PageLayout>
      );
    }

    const stayHouse = getHouseById(guestStay.houseId);
    const arrivalProgress = guestStay.arrivalChecklist.filter((i) => i.checked).length;
    const departureProgress = guestStay.departureChecklist.filter((i) => i.checked).length;

    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Guest Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome to {stayHouse?.name}</h1>
            <p className="text-slate-500 mt-1">
              {formatDateRange(guestStay.startDate, guestStay.endDate)} · {getDaysBetween(new Date(), guestStay.endDate)} days remaining
            </p>
          </div>

          {/* Stay Status Card */}
          <Card className="bg-gradient-to-r from-primary-600 to-primary-500 border-0">
            <CardBody className="p-6 text-white">
              <Badge variant="success" className="mb-3">
                {getStayStatusDisplay(guestStay.status)}
              </Badge>
              <h2 className="text-xl font-bold">{stayHouse?.nickname || stayHouse?.name}</h2>
              <p className="text-primary-100 mt-1">{stayHouse?.address}</p>
            </CardBody>
          </Card>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Link href="/checklist">
              <Card hover className="h-full">
                <CardBody className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FiCheckSquare className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Checklists</h3>
                    <p className="text-sm text-slate-500">
                      {guestStay.status === 'active' && guestStay.departureChecklistActive
                        ? `${departureProgress}/${guestStay.departureChecklist.length} departure tasks`
                        : `${arrivalProgress}/${guestStay.arrivalChecklist.length} arrival tasks`}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Link>
            <Link href="/safety">
              <Card hover className="h-full">
                <CardBody className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <FiShield className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Safety Info</h3>
                    <p className="text-sm text-slate-500">Emergency contacts & info</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
            <Link href="/house-info">
              <Card hover className="h-full">
                <CardBody className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <FiHome className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">House Info</h3>
                    <p className="text-sm text-slate-500">Rules & property details</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
            <Link href="/report-issue">
              <Card hover className="h-full">
                <CardBody className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <FiAlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Report Issue</h3>
                    <p className="text-sm text-slate-500">Report maintenance or damage</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          </div>

          {/* House Rules Reminder */}
          {stayHouse?.rules && stayHouse.rules.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-slate-800">House Rules</h3>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2">
                  {stayHouse.rules.slice(0, 3).map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                      <FiCheckCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      {rule}
                    </li>
                  ))}
                </ul>
                {stayHouse.rules.length > 3 && (
                  <Link href="/house-info" className="text-sm text-primary-600 hover:text-primary-700 font-medium mt-3 inline-block">
                    View all {stayHouse.rules.length} rules →
                  </Link>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </PageLayout>
    );
  }

  // Cleaner Dashboard
  if (isCleaner()) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cleaning Tasks</h1>
            <p className="text-slate-500 mt-1">Your assigned cleaning tasks</p>
          </div>

          {pendingCleaning.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center">
                <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800">All caught up!</h3>
                <p className="text-sm text-slate-500 mt-1">No pending cleaning tasks</p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingCleaning.map((task) => {
                const house = getHouseById(task.houseId);
                const completedItems = task.checklist.filter((i) => i.checked).length;
                return (
                  <Link key={task.id} href={`/cleaning/${task.id}`}>
                    <Card hover>
                      <CardBody className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-800">{house?.name}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {completedItems}/{task.checklist.length} tasks completed
                            </p>
                          </div>
                          <Badge variant={task.status === 'in_progress' ? 'warning' : 'info'}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="mt-3 bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${(completedItems / task.checklist.length) * 100}%` }}
                          />
                        </div>
                      </CardBody>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </PageLayout>
    );
  }

  return null;
}
