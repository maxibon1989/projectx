'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  Input,
  TextArea,
  Badge,
  Avatar,
  AvatarGroup,
  Checkbox,
  EmptyState,
} from '@/components/ui';
import { Stay, StayStatus, ChecklistItem } from '@/types';
import {
  formatDate,
  formatDateRange,
  generateId,
  getStayColor,
  datesOverlap,
  createDefaultArrivalChecklist,
  createDefaultDepartureChecklist,
} from '@/lib/utils';
import {
  FiCalendar,
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiUsers,
  FiHome,
  FiCheck,
  FiX,
} from 'react-icons/fi';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarPage() {
  const { state, dispatch, getHouseById, getStaysForHouse, getMemberById } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showStayModal, setShowStayModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [checklistType, setChecklistType] = useState<'arrival' | 'departure'>('arrival');

  // Form states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedAttendees, setSelectedAttendees] = useState<string[]>([]);
  const [arrivalNotes, setArrivalNotes] = useState('');

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  const stays = selectedHouse ? getStaysForHouse(selectedHouse.id) : [];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const days: { date: Date; isCurrentMonth: boolean; stays: Stay[] }[] = [];

    // Previous month days
    for (let i = startOffset - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false, stays: [] });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dayStays = stays.filter((stay) => {
        const start = new Date(stay.startDate);
        const end = new Date(stay.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        date.setHours(12, 0, 0, 0);
        return date >= start && date <= end;
      });
      days.push({ date, isCurrentMonth: true, stays: dayStays });
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false, stays: [] });
    }

    return days;
  }, [currentDate, stays]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const resetForm = () => {
    setStartDate('');
    setEndDate('');
    setSelectedAttendees([]);
    setArrivalNotes('');
  };

  const handleCreateStay = () => {
    if (!selectedHouse || !startDate || !endDate || selectedAttendees.length === 0) return;

    const newStay: Stay = {
      id: generateId(),
      houseId: selectedHouse.id,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      attendees: selectedAttendees,
      roomAssignments: [],
      arrivalNotes: arrivalNotes.trim() || undefined,
      arrivalChecklist: selectedHouse.defaultArrivalChecklist.map((item) => ({
        ...item,
        id: generateId(),
        checked: false,
      })),
      departureChecklist: selectedHouse.defaultDepartureChecklist.map((item) => ({
        ...item,
        id: generateId(),
        checked: false,
      })),
      status: 'planned',
      createdBy: state.currentUser?.id || '',
      createdAt: new Date(),
      color: getStayColor(stays.length),
    };

    // Check for overlaps
    const hasOverlap = stays.some(
      (stay) =>
        stay.status !== 'cancelled' &&
        datesOverlap(newStay.startDate, newStay.endDate, stay.startDate, stay.endDate)
    );

    if (hasOverlap && !confirm('This stay overlaps with an existing booking. Continue anyway?')) {
      return;
    }

    dispatch({ type: 'ADD_STAY', payload: newStay });
    resetForm();
    setShowStayModal(false);
  };

  const handleUpdateStatus = (stayId: string, status: StayStatus) => {
    const stay = stays.find((s) => s.id === stayId);
    if (!stay) return;

    dispatch({
      type: 'UPDATE_STAY',
      payload: { ...stay, status },
    });
  };

  const handleDeleteStay = (stayId: string) => {
    if (confirm('Are you sure you want to delete this stay?')) {
      dispatch({ type: 'DELETE_STAY', payload: stayId });
      setShowDetailsModal(false);
      setSelectedStay(null);
    }
  };

  const handleChecklistToggle = (itemId: string) => {
    if (!selectedStay) return;

    const checklistKey = checklistType === 'arrival' ? 'arrivalChecklist' : 'departureChecklist';
    const updatedChecklist = selectedStay[checklistKey].map((item) =>
      item.id === itemId
        ? { ...item, checked: !item.checked, checkedBy: state.currentUser?.id, checkedAt: new Date() }
        : item
    );

    dispatch({
      type: 'UPDATE_STAY_CHECKLIST',
      payload: { stayId: selectedStay.id, type: checklistType, checklist: updatedChecklist },
    });

    setSelectedStay({
      ...selectedStay,
      [checklistKey]: updatedChecklist,
    });
  };

  const openStayDetails = (stay: Stay) => {
    setSelectedStay(stay);
    setShowDetailsModal(true);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const toggleAttendee = (memberId: string) => {
    setSelectedAttendees((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  if (!selectedHouse) {
    return (
      <PageLayout title="Calendar">
        <EmptyState
          icon={<FiCalendar className="w-8 h-8" />}
          title="No house selected"
          description="Select a house from the sidebar to view its calendar."
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Calendar">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold text-slate-800 min-w-[180px] text-center">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
            <Button variant="outline" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>
          <Button onClick={() => setShowStayModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Plan Stay
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card className="overflow-hidden">
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-3 text-center text-sm font-medium text-slate-600"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[100px] md:min-h-[120px] border-b border-r border-slate-100 p-1 ${
                  !day.isCurrentMonth ? 'bg-slate-50/50' : ''
                }`}
              >
                <div
                  className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday(day.date)
                      ? 'bg-slate-800 text-white'
                      : day.isCurrentMonth
                      ? 'text-slate-700'
                      : 'text-slate-400'
                  }`}
                >
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.stays.slice(0, 2).map((stay) => (
                    <button
                      key={stay.id}
                      onClick={() => openStayDetails(stay)}
                      className="w-full text-left px-1.5 py-0.5 rounded text-xs font-medium text-white truncate hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: stay.color || '#3B82F6' }}
                    >
                      {stay.attendees
                        .map((id) => getMemberById(id)?.name.split(' ')[0])
                        .filter(Boolean)
                        .join(', ')}
                    </button>
                  ))}
                  {day.stays.length > 2 && (
                    <div className="text-xs text-slate-500 px-1">
                      +{day.stays.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Stays List */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-slate-800">All Stays</h3>
          </CardHeader>
          <CardBody className="p-0">
            {stays.length === 0 ? (
              <div className="p-6 text-center text-slate-500">
                No stays planned yet
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {stays.map((stay) => (
                  <li
                    key={stay.id}
                    className="p-4 hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => openStayDetails(stay)}
                  >
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
                      <Badge
                        variant={
                          stay.status === 'active'
                            ? 'success'
                            : stay.status === 'completed'
                            ? 'neutral'
                            : stay.status === 'cancelled'
                            ? 'danger'
                            : 'info'
                        }
                      >
                        {stay.status}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Create Stay Modal */}
      <Modal
        isOpen={showStayModal}
        onClose={() => {
          setShowStayModal(false);
          resetForm();
        }}
        title="Plan a Stay"
        size="lg"
      >
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Who's coming?
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {state.familyGroup?.members.map((member) => (
                <button
                  key={member.id}
                  onClick={() => toggleAttendee(member.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
                    selectedAttendees.includes(member.id)
                      ? 'border-slate-800 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <Avatar name={member.name} size="sm" />
                  <span className="text-sm font-medium text-slate-700">
                    {member.name}
                  </span>
                  {selectedAttendees.includes(member.id) && (
                    <FiCheck className="w-4 h-4 text-green-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <TextArea
            label="Arrival Notes (optional)"
            placeholder="e.g., Arriving around 3 PM"
            rows={2}
            value={arrivalNotes}
            onChange={(e) => setArrivalNotes(e.target.value)}
          />

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowStayModal(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStay}
              fullWidth
              disabled={!startDate || !endDate || selectedAttendees.length === 0}
            >
              Create Stay
            </Button>
          </div>
        </div>
      </Modal>

      {/* Stay Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedStay(null);
        }}
        title="Stay Details"
        size="lg"
      >
        {selectedStay && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  {formatDateRange(selectedStay.startDate, selectedStay.endDate)}
                </h3>
                <Badge
                  variant={
                    selectedStay.status === 'active'
                      ? 'success'
                      : selectedStay.status === 'completed'
                      ? 'neutral'
                      : selectedStay.status === 'cancelled'
                      ? 'danger'
                      : 'info'
                  }
                >
                  {selectedStay.status}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-700 mb-2">Attendees</h4>
              <div className="flex flex-wrap gap-2">
                {selectedStay.attendees.map((id) => {
                  const member = getMemberById(id);
                  return member ? (
                    <div key={id} className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1">
                      <Avatar name={member.name} size="sm" />
                      <span className="text-sm">{member.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {selectedStay.arrivalNotes && (
              <div>
                <h4 className="text-sm font-medium text-slate-700 mb-1">Arrival Notes</h4>
                <p className="text-sm text-slate-600">{selectedStay.arrivalNotes}</p>
              </div>
            )}

            {/* Checklists */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() => setChecklistType('arrival')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    checklistType === 'arrival'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Arrival Checklist
                </button>
                <button
                  onClick={() => setChecklistType('departure')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    checklistType === 'departure'
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Departure Checklist
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(checklistType === 'arrival'
                  ? selectedStay.arrivalChecklist
                  : selectedStay.departureChecklist
                ).map((item) => (
                  <Checkbox
                    key={item.id}
                    checked={item.checked}
                    onChange={() => handleChecklistToggle(item.id)}
                    label={item.text}
                  />
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="border-t border-slate-100 pt-4 flex gap-2">
              {selectedStay.status === 'planned' && (
                <Button
                  variant="primary"
                  onClick={() => handleUpdateStatus(selectedStay.id, 'active')}
                  fullWidth
                >
                  Start Stay
                </Button>
              )}
              {selectedStay.status === 'active' && (
                <Button
                  variant="primary"
                  onClick={() => handleUpdateStatus(selectedStay.id, 'completed')}
                  fullWidth
                >
                  Complete Stay
                </Button>
              )}
              <Button
                variant="danger"
                onClick={() => handleDeleteStay(selectedStay.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageLayout>
  );
}
