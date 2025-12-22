'use client';

import { useState } from 'react';
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
  EmptyState,
} from '@/components/ui';
import { Issue, IssueStatus, IssueType, IssueSeverity } from '@/types';
import { formatRelativeTime, generateId, getIssueTypeDisplay, getIssueSeverityColor } from '@/lib/utils';
import {
  FiAlertCircle,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiShield,
  FiTool,
  FiAlertTriangle,
  FiFilter,
} from 'react-icons/fi';

const statuses: { value: IssueStatus; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'fixed', label: 'Fixed' },
];

const issueTypes: { value: IssueType; label: string; icon: React.ReactNode }[] = [
  { value: 'maintenance', label: 'Maintenance', icon: <FiTool className="w-4 h-4" /> },
  { value: 'damage', label: 'Damage', icon: <FiAlertTriangle className="w-4 h-4" /> },
  { value: 'safety', label: 'Safety', icon: <FiShield className="w-4 h-4" /> },
];

const severityLevels: { value: IssueSeverity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function IssuesPage() {
  const {
    state,
    dispatch,
    getHouseById,
    getIssuesForHouse,
    getOpenIssuesForHouse,
    getSafetyIssuesForHouse,
    getMemberById,
    closeIssue,
    isOwner,
  } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [statusFilter, setStatusFilter] = useState<IssueStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<IssueType | 'all'>('all');

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [issueType, setIssueType] = useState<IssueType>('maintenance');
  const [severity, setSeverity] = useState<IssueSeverity>('medium');
  const [issueStatus, setIssueStatus] = useState<IssueStatus>('open');

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  const allIssues = selectedHouse ? getIssuesForHouse(selectedHouse.id) : [];
  const safetyIssues = selectedHouse ? getSafetyIssuesForHouse(selectedHouse.id) : [];

  // Apply filters
  let filteredIssues = allIssues;
  if (statusFilter !== 'all') {
    filteredIssues = filteredIssues.filter((i) => i.status === statusFilter);
  }
  if (typeFilter !== 'all') {
    filteredIssues = filteredIssues.filter((i) => i.type === typeFilter);
  }

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedRoom('');
    setIssueType('maintenance');
    setSeverity('medium');
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
        type: issueType,
        severity,
        status: issueStatus,
        resolvedAt: issueStatus === 'fixed' ? new Date() : undefined,
        resolvedBy: issueStatus === 'fixed' ? state.currentUser?.id : undefined,
      };
      dispatch({ type: 'UPDATE_ISSUE', payload: updatedIssue });
    } else {
      const newIssue: Issue = {
        id: generateId(),
        houseId: selectedHouse.id,
        title: title.trim(),
        description: description.trim(),
        type: issueType,
        severity,
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
        resolvedBy: status === 'fixed' ? state.currentUser?.id : undefined,
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
    setIssueType(issue.type);
    setSeverity(issue.severity);
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

  const getSeverityBadge = (severity: IssueSeverity) => {
    const variants: Record<IssueSeverity, 'neutral' | 'info' | 'warning' | 'danger'> = {
      low: 'neutral',
      medium: 'info',
      high: 'warning',
      critical: 'danger',
    };
    return variants[severity];
  };

  const getTypeIcon = (type: IssueType) => {
    switch (type) {
      case 'maintenance':
        return <FiTool className="w-4 h-4 text-blue-500" />;
      case 'damage':
        return <FiAlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'safety':
        return <FiShield className="w-4 h-4 text-rose-500" />;
    }
  };

  if (!selectedHouse) {
    return (
      <PageLayout>
        <EmptyState
          icon={<FiAlertCircle className="w-8 h-8" />}
          title="No property selected"
          description="Select a property from the sidebar to view its issues."
        />
      </PageLayout>
    );
  }

  const openCount = allIssues.filter((i) => i.status !== 'fixed').length;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Issues</h1>
            <p className="text-slate-500 text-sm mt-1">
              {selectedHouse.name} · {allIssues.length} total issues
            </p>
          </div>
          <Button onClick={() => setShowModal(true)}>
            <FiPlus className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>

        {/* Safety Alert */}
        {safetyIssues.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <FiShield className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-rose-800">Safety Issues Require Immediate Attention</h3>
              <p className="text-sm text-rose-700 mt-0.5">
                {safetyIssues.length} safety {safetyIssues.length === 1 ? 'issue' : 'issues'} marked as open
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <Card>
          <CardBody className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FiFilter className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">Filters:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as IssueStatus | 'all')}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="all">All Statuses</option>
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {/* Type Filter */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as IssueType | 'all')}
                  className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                >
                  <option value="all">All Types</option>
                  {issueTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              {(statusFilter !== 'all' || typeFilter !== 'all') && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setTypeFilter('all');
                  }}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Issues List */}
        {filteredIssues.length === 0 ? (
          <Card>
            <CardBody className="py-12 text-center">
              {statusFilter === 'all' && typeFilter === 'all' ? (
                <>
                  <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-1">No issues reported</h3>
                  <p className="text-sm text-slate-500">Great! Everything seems to be in order.</p>
                </>
              ) : (
                <>
                  <FiAlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-semibold text-slate-800 mb-1">No matching issues</h3>
                  <p className="text-sm text-slate-500">Try adjusting your filters.</p>
                </>
              )}
            </CardBody>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredIssues.map((issue) => {
              const reporter = getMemberById(issue.reportedBy);
              const assignedTo = issue.assignedTo ? getMemberById(issue.assignedTo) : null;
              const room = selectedHouse.rooms.find((r) => r.id === issue.roomId);

              return (
                <Card
                  key={issue.id}
                  className={`border-l-4 ${
                    issue.type === 'safety'
                      ? 'border-l-rose-500'
                      : issue.type === 'damage'
                      ? 'border-l-amber-500'
                      : 'border-l-blue-500'
                  }`}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {getTypeIcon(issue.type)}
                          <h3 className="font-medium text-slate-800">{issue.title}</h3>
                          <Badge variant={getStatusBadge(issue.status)} size="sm">
                            {issue.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant={getSeverityBadge(issue.severity)} size="sm">
                            {issue.severity}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-slate-500 mb-2">
                          <span className="capitalize">{getIssueTypeDisplay(issue.type)}</span>
                          {room && (
                            <>
                              <span>·</span>
                              <span>{room.name}</span>
                            </>
                          )}
                        </div>

                        {issue.description && (
                          <p className="text-sm text-slate-600 mb-3">
                            {issue.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                          <span>
                            Reported by {reporter?.name || 'Unknown'}{' '}
                            {formatRelativeTime(issue.createdAt)}
                          </span>
                          {issue.resolvedAt && (
                            <span>· Fixed {formatRelativeTime(issue.resolvedAt)}</span>
                          )}
                        </div>

                        {/* Assignment */}
                        <div className="flex items-center gap-3 mb-3">
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
                          <div className="flex flex-wrap gap-2">
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
                            {isOwner() && (
                              <Button
                                size="sm"
                                onClick={() => handleUpdateStatus(issue, 'fixed')}
                              >
                                <FiCheckCircle className="w-3 h-3 mr-1" />
                                Mark Fixed
                              </Button>
                            )}
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
                        {isOwner() && (
                          <button
                            onClick={() => handleDelete(issue.id)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-600"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Issue Type
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as IssueType)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {issueTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IssueSeverity)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {severityLevels.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TextArea
            label="Description"
            placeholder="Describe the issue in more detail..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Room (optional)
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

          {issueType === 'safety' && (
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2">
              <FiShield className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">
                Safety issues are highlighted and prioritized for immediate attention.
              </p>
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
