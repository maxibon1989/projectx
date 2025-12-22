'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import {
  Card,
  CardBody,
  Button,
  Modal,
  Input,
  TextArea,
  Badge,
  Avatar,
  EmptyState,
} from '@/components/ui';
import { Issue, IssueStatus } from '@/types';
import { formatRelativeTime, generateId } from '@/lib/utils';
import {
  FiAlertCircle,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiUser,
} from 'react-icons/fi';

const statuses: { value: IssueStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'fixed', label: 'Fixed' },
];

export default function IssuesPage() {
  const { state, dispatch, getHouseById, getIssuesForHouse, getMemberById } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [filter, setFilter] = useState<IssueStatus | 'all'>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [issueStatus, setIssueStatus] = useState<IssueStatus>('open');

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  const allIssues = selectedHouse ? getIssuesForHouse(selectedHouse.id) : [];
  const issues = filter === 'all' ? allIssues : allIssues.filter((i) => i.status === filter);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedRoom('');
    setIssueStatus('open');
    setEditingIssue(null);
  };

  const handleSubmit = () => {
    if (!selectedHouse || !title.trim()) return;

    if (editingIssue) {
      const updatedIssue: Issue = {
        ...editingIssue,
        title: title.trim(),
        description: description.trim(),
        roomId: selectedRoom || undefined,
        status: issueStatus,
        resolvedAt: issueStatus === 'fixed' ? new Date() : undefined,
      };
      dispatch({ type: 'UPDATE_ISSUE', payload: updatedIssue });
    } else {
      const newIssue: Issue = {
        id: generateId(),
        houseId: selectedHouse.id,
        title: title.trim(),
        description: description.trim(),
        photos: [],
        status: 'open',
        reportedBy: state.currentUser?.id || '',
        roomId: selectedRoom || undefined,
        createdAt: new Date(),
      };
      dispatch({ type: 'ADD_ISSUE', payload: newIssue });
    }

    resetForm();
    setShowModal(false);
  };

  const handleUpdateStatus = (issue: Issue, status: IssueStatus) => {
    dispatch({
      type: 'UPDATE_ISSUE',
      payload: {
        ...issue,
        status,
        resolvedAt: status === 'fixed' ? new Date() : undefined,
      },
    });
  };

  const handleAssignToMe = (issue: Issue) => {
    dispatch({
      type: 'UPDATE_ISSUE',
      payload: { ...issue, assignedTo: state.currentUser?.id },
    });
  };

  const handleDelete = (issueId: string) => {
    if (confirm('Delete this issue?')) {
      dispatch({ type: 'DELETE_ISSUE', payload: issueId });
    }
  };

  const openEditModal = (issue: Issue) => {
    setEditingIssue(issue);
    setTitle(issue.title);
    setDescription(issue.description);
    setSelectedRoom(issue.roomId || '');
    setIssueStatus(issue.status);
    setShowModal(true);
  };

  const getStatusBadge = (status: IssueStatus) => {
    const variants: Record<IssueStatus, 'danger' | 'warning' | 'info' | 'success'> = {
      open: 'danger',
      planned: 'warning',
      in_progress: 'info',
      fixed: 'success',
    };
    return variants[status];
  };

  if (!selectedHouse) {
    return (
      <PageLayout title="Issues">
        <EmptyState
          icon={<FiAlertCircle className="w-8 h-8" />}
          title="No house selected"
          description="Select a house from the sidebar to view its issues."
        />
      </PageLayout>
    );
  }

  const openCount = allIssues.filter((i) => i.status !== 'fixed').length;

  return (
    <PageLayout title="Issues">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-slate-500">
              Track maintenance issues for {selectedHouse.name}
            </p>
            {openCount > 0 && (
              <p className="text-sm text-amber-600 mt-1">
                {openCount} open {openCount === 1 ? 'issue' : 'issues'} requiring attention
              </p>
            )}
          </div>
          <Button onClick={() => setShowModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({allIssues.length})
          </button>
          {statuses.map((s) => {
            const count = allIssues.filter((i) => i.status === s.value).length;
            return (
              <button
                key={s.value}
                onClick={() => setFilter(s.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === s.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Issues List */}
        {issues.length === 0 ? (
          <EmptyState
            icon={
              filter === 'all' ? (
                <FiCheckCircle className="w-8 h-8" />
              ) : (
                <FiAlertCircle className="w-8 h-8" />
              )
            }
            title={
              filter === 'all'
                ? 'No issues reported'
                : `No ${filter.replace('_', ' ')} issues`
            }
            description={
              filter === 'all'
                ? 'Great! Everything seems to be in order.'
                : undefined
            }
          />
        ) : (
          <div className="space-y-4">
            {issues.map((issue) => {
              const reporter = getMemberById(issue.reportedBy);
              const assignedTo = issue.assignedTo ? getMemberById(issue.assignedTo) : null;
              const room = selectedHouse.rooms.find((r) => r.id === issue.roomId);

              return (
                <Card key={issue.id} className={`status-${issue.status} border-l-4`}>
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-slate-800">{issue.title}</h3>
                          <Badge variant={getStatusBadge(issue.status)} size="sm">
                            {issue.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        {room && (
                          <p className="text-sm text-slate-500 mb-1">
                            Location: {room.name}
                          </p>
                        )}
                        {issue.description && (
                          <p className="text-sm text-slate-600 mb-2">
                            {issue.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span>
                            Reported by {reporter?.name || 'Unknown'}{' '}
                            {formatRelativeTime(issue.createdAt)}
                          </span>
                        </div>

                        {/* Assignment */}
                        <div className="mt-3 flex items-center gap-3">
                          {assignedTo ? (
                            <div className="flex items-center gap-2">
                              <Avatar name={assignedTo.name} size="sm" />
                              <span className="text-sm text-slate-600">
                                Assigned to {assignedTo.name}
                              </span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAssignToMe(issue)}
                              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                            >
                              <FiUser className="w-4 h-4" />
                              Assign to me
                            </button>
                          )}
                        </div>

                        {/* Status Actions */}
                        {issue.status !== 'fixed' && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {issue.status === 'open' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(issue, 'planned')}
                              >
                                <FiClock className="w-3 h-3 mr-1" />
                                Mark Planned
                              </Button>
                            )}
                            {(issue.status === 'open' || issue.status === 'planned') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpdateStatus(issue, 'in_progress')}
                              >
                                Start Working
                              </Button>
                            )}
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleUpdateStatus(issue, 'fixed')}
                            >
                              <FiCheckCircle className="w-3 h-3 mr-1" />
                              Mark Fixed
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(issue)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600"
                          title="Edit"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(issue.id)}
                          className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"
                          title="Delete"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingIssue ? 'Edit Issue' : 'Report Issue'}
        size="md"
      >
        <div className="p-4 space-y-4">
          <Input
            label="Issue Title"
            placeholder="e.g., Broken lamp in bedroom"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <TextArea
            label="Description"
            placeholder="Describe the issue in more detail..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Location (optional)
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">General / Not specific</option>
              {selectedHouse?.rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>
          {editingIssue && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                value={issueStatus}
                onChange={(e) => setIssueStatus(e.target.value as IssueStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {statuses.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              fullWidth
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} fullWidth disabled={!title.trim()}>
              {editingIssue ? 'Save Changes' : 'Report Issue'}
            </Button>
          </div>
        </div>
      </Modal>
    </PageLayout>
  );
}
