'use client';

import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Badge, Button, EmptyState, Checkbox } from '@/components/ui';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import {
  FiCheckSquare,
  FiCheckCircle,
  FiClock,
  FiHome,
  FiAlertCircle,
  FiChevronRight,
} from 'react-icons/fi';
import { CleaningTask } from '@/types';

export default function CleaningPage() {
  const {
    state,
    getHouseById,
    getPendingCleaningTasks,
    getMemberById,
    dispatch,
    isOwner,
    isCohost,
    isCleaner,
  } = useApp();

  const pendingTasks = getPendingCleaningTasks();
  const completedTasks = state.cleaningTasks.filter((t) => t.status === 'completed');

  // For owner/cohost, filter by selected house
  const selectedHouse = state.selectedHouseId ? getHouseById(state.selectedHouseId) : null;
  const houseTasks = selectedHouse
    ? state.cleaningTasks.filter((t) => t.houseId === selectedHouse.id)
    : state.cleaningTasks;

  const pendingHouseTasks = houseTasks.filter((t) => t.status !== 'completed');
  const completedHouseTasks = houseTasks.filter((t) => t.status === 'completed');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'info'> = {
      pending: 'info',
      in_progress: 'warning',
      completed: 'success',
    };
    return variants[status] || 'info';
  };

  const updateTaskStatus = (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    const task = state.cleaningTasks.find((t) => t.id === taskId);
    if (!task) return;

    dispatch({
      type: 'UPDATE_CLEANING_TASK',
      payload: {
        ...task,
        status,
        completedAt: status === 'completed' ? new Date() : undefined,
      },
    });
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    const task = state.cleaningTasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedChecklist = task.checklist.map((item) =>
      item.id === itemId
        ? { ...item, checked: !item.checked, checkedAt: !item.checked ? new Date() : undefined }
        : item
    );

    const allChecked = updatedChecklist.every((item) => item.checked);

    dispatch({
      type: 'UPDATE_CLEANING_TASK',
      payload: {
        ...task,
        checklist: updatedChecklist,
        status: allChecked ? 'completed' : task.status === 'pending' ? 'in_progress' : task.status,
        completedAt: allChecked ? new Date() : undefined,
      },
    });
  };

  // Cleaner view
  if (isCleaner()) {
    return (
      <PageLayout>
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">My Cleaning Tasks</h1>
            <p className="text-slate-500 mt-1">Your assigned cleaning tasks</p>
          </div>

          {pendingTasks.length === 0 ? (
            <Card>
              <CardBody className="py-12 text-center">
                <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800">All caught up!</h3>
                <p className="text-sm text-slate-500 mt-1">No pending cleaning tasks</p>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map((task) => {
                const house = getHouseById(task.houseId);
                const completedItems = task.checklist.filter((i) => i.checked).length;
                const progress = (completedItems / task.checklist.length) * 100;

                return (
                  <Card key={task.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <FiHome className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800">{house?.name}</h3>
                            <p className="text-xs text-slate-500">{house?.address?.split(',')[0]}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadge(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardBody>
                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-600">Progress</span>
                          <span className="font-medium text-slate-800">
                            {completedItems}/{task.checklist.length}
                          </span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-2">
                          <div
                            className="bg-primary-500 h-2 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Checklist */}
                      <ul className="space-y-2">
                        {task.checklist.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <Checkbox
                              checked={item.checked}
                              onChange={() => toggleChecklistItem(task.id, item.id)}
                            />
                            <span className={`text-sm ${item.checked ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                              {item.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Actions */}
                      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                        <Link href="/report-issue" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full">
                            <FiAlertCircle className="w-4 h-4 mr-2" />
                            Report Issue
                          </Button>
                        </Link>
                        {progress === 100 && task.status !== 'completed' && (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => updateTaskStatus(task.id, 'completed')}
                          >
                            <FiCheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                        )}
                      </div>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </PageLayout>
    );
  }

  // Owner/Cohost view
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Cleaning Tasks</h1>
            <p className="text-slate-500 text-sm mt-1">
              {selectedHouse ? selectedHouse.name : 'All properties'} · {pendingHouseTasks.length} pending
            </p>
          </div>
        </div>

        {/* Pending Tasks */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiClock className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-slate-800">Pending Tasks ({pendingHouseTasks.length})</h2>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {pendingHouseTasks.length === 0 ? (
              <div className="p-8 text-center">
                <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="font-semibold text-slate-800 mb-1">No pending tasks</h3>
                <p className="text-sm text-slate-500">All cleaning tasks are completed.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pendingHouseTasks.map((task) => {
                  const house = getHouseById(task.houseId);
                  const cleaner = task.assignedTo ? getMemberById(task.assignedTo) : null;
                  const completedItems = task.checklist.filter((i) => i.checked).length;
                  const progress = (completedItems / task.checklist.length) * 100;

                  return (
                    <li key={task.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                            <FiHome className="w-6 h-6 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{house?.name}</p>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {cleaner ? `Assigned to ${cleaner.name}` : 'Unassigned'} ·
                              Created {formatRelativeTime(task.createdAt)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="w-24 bg-slate-100 rounded-full h-1.5">
                                <div
                                  className="bg-primary-500 h-1.5 rounded-full"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">
                                {completedItems}/{task.checklist.length}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusBadge(task.status)}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <FiChevronRight className="w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Completed Tasks */}
        {completedHouseTasks.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <h2 className="font-semibold text-slate-800">Completed ({completedHouseTasks.length})</h2>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {completedHouseTasks.slice(0, 5).map((task) => {
                  const house = getHouseById(task.houseId);
                  const cleaner = task.assignedTo ? getMemberById(task.assignedTo) : null;

                  return (
                    <li key={task.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <FiCheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{house?.name}</p>
                            <p className="text-sm text-slate-500 mt-0.5">
                              {cleaner ? `Cleaned by ${cleaner.name}` : 'Completed'} ·
                              {task.completedAt && formatDate(task.completedAt)}
                            </p>
                          </div>
                        </div>
                        <Badge variant="success">Completed</Badge>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </CardBody>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
