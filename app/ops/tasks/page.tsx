'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiCheckCircle, FiClock, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

// Page 9: Task Queue
type ViewMode = 'stage' | 'sla' | 'owner';

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('stage');
  const [stageFilter, setStageFilter] = useState<string>('all');

  const tasks = [
    { id: 't1', title: 'Request pension provider quote', stage: 'provider_setup', status: 'pending', owner: 'Erik L.', dueDate: '2024-02-15', overdue: false },
    { id: 't2', title: 'Complete employee data upload', stage: 'onboarding', status: 'in_progress', owner: 'Anna S.', dueDate: '2024-02-10', overdue: true },
    { id: 't3', title: 'Review insurance terms', stage: 'provider_setup', status: 'pending', owner: null, dueDate: '2024-02-20', overdue: false },
    { id: 't4', title: 'Send enrollment invites batch 1', stage: 'enrollment', status: 'completed', owner: 'Maria J.', dueDate: '2024-02-05', overdue: false },
    { id: 't5', title: 'Sign certificate', stage: 'certificate', status: 'pending', owner: 'CEO', dueDate: '2024-02-18', overdue: false },
  ];

  const stages = [
    { key: 'all', label: 'All' },
    { key: 'onboarding', label: 'Onboarding' },
    { key: 'provider_setup', label: 'Provider Setup' },
    { key: 'enrollment', label: 'Enrollment' },
    { key: 'certificate', label: 'Certificate' },
    { key: 'monitoring', label: 'Monitoring' },
  ];

  const filteredTasks = tasks.filter((t) => stageFilter === 'all' || t.stage === stageFilter);

  const statusColors = {
    pending: 'gray',
    in_progress: 'blue',
    blocked: 'red',
    completed: 'green',
  };

  return (
    <PageLayout title="Operations">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-gray-600">
            Manage operational tasks across the platform.
          </p>
          <Button>
            <FiPlus className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex gap-2">
          {[
            { key: 'stage', label: 'By Stage' },
            { key: 'sla', label: 'By SLA' },
            { key: 'owner', label: 'By Owner' },
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setViewMode(mode.key as ViewMode)}
              className={`px-4 py-2 rounded-lg text-sm ${
                viewMode === mode.key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Stage Filter (when viewing by stage) */}
        {viewMode === 'stage' && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {stages.map((stage) => (
              <button
                key={stage.key}
                onClick={() => setStageFilter(stage.key)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap ${
                  stageFilter === stage.key
                    ? 'bg-primary/10 text-primary border border-primary'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold">{tasks.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => t.overdue).length}
              </p>
              <p className="text-sm text-gray-500">Overdue</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-500">Completed</p>
            </div>
          </Card>
        </div>

        {/* Task List */}
        <Card>
          <div className="divide-y">
            {filteredTasks.map((task) => (
              <Link
                key={task.id}
                href={`/ops/tasks/${task.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    task.status === 'completed' ? 'bg-green-100' : task.overdue ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {task.status === 'completed' ? (
                      <FiCheckCircle className="w-5 h-5 text-green-600" />
                    ) : task.overdue ? (
                      <FiAlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <FiClock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="gray" size="sm">{task.stage.replace('_', ' ')}</Badge>
                      <span>|</span>
                      <span>Due {task.dueDate}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{task.owner || 'Unassigned'}</span>
                  <Badge variant={statusColors[task.status as keyof typeof statusColors] as 'gray' | 'blue' | 'red' | 'green'}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
