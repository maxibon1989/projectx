'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiMessageCircle, FiClock, FiUser } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

// Page 10: Ticketing
export default function TicketsPage() {
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  const tickets = [
    {
      id: 'tk1',
      title: 'Question about salary exchange impact',
      source: 'employee_wallet',
      severity: 'low',
      status: 'open',
      employee: 'Anna Svensson',
      assignee: 'Support Team',
      createdAt: '2024-02-10T10:30:00',
      firstResponseAt: null,
    },
    {
      id: 'tk2',
      title: 'Unable to access pension statement',
      source: 'employee_wallet',
      severity: 'medium',
      status: 'in_progress',
      employee: 'Erik Lindgren',
      assignee: 'Maria J.',
      createdAt: '2024-02-09T14:20:00',
      firstResponseAt: '2024-02-09T15:45:00',
    },
    {
      id: 'tk3',
      title: 'Certificate signing process unclear',
      source: 'company_workspace',
      severity: 'high',
      status: 'resolved',
      employee: null,
      assignee: 'Erik L.',
      createdAt: '2024-02-05T09:00:00',
      firstResponseAt: '2024-02-05T09:15:00',
    },
  ];

  const filteredTickets = tickets.filter((t) => {
    if (filter === 'open') return t.status === 'open' || t.status === 'in_progress';
    if (filter === 'resolved') return t.status === 'resolved';
    return true;
  });

  const severityColors = {
    low: 'gray',
    medium: 'amber',
    high: 'red',
    critical: 'red',
  };

  const statusColors = {
    open: 'amber',
    in_progress: 'blue',
    resolved: 'green',
    closed: 'gray',
  };

  const getTimeToResponse = (created: string, responded: string | null) => {
    if (!responded) {
      const now = new Date();
      const createdAt = new Date(created);
      const diff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));
      return `${diff}m waiting`;
    }
    const createdAt = new Date(created);
    const respondedAt = new Date(responded);
    const diff = Math.floor((respondedAt.getTime() - createdAt.getTime()) / (1000 * 60));
    return `${diff}m response time`;
  };

  return (
    <PageLayout title="Support">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-gray-600">
              Manage support tickets from company workspace and employee wallet.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              If we miss a contribution, you see it here first.
            </p>
          </div>
          <Button>
            <FiPlus className="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All Tickets' },
            { key: 'open', label: 'Open' },
            { key: 'resolved', label: 'Resolved' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f.key
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {tickets.filter((t) => t.status === 'open').length}
              </p>
              <p className="text-sm text-gray-500">Open</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">
                {tickets.filter((t) => t.status === 'in_progress').length}
              </p>
              <p className="text-sm text-gray-500">In Progress</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {tickets.filter((t) => t.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-500">Resolved</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold">15m</p>
              <p className="text-sm text-gray-500">Avg Response</p>
            </div>
          </Card>
        </div>

        {/* Ticket List */}
        <Card>
          <div className="divide-y">
            {filteredTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/support/tickets/${ticket.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FiMessageCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{ticket.title}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Badge variant="gray" size="sm">
                        {ticket.source === 'employee_wallet' ? 'Employee' : 'Company'}
                      </Badge>
                      {ticket.employee && (
                        <>
                          <span>|</span>
                          <span>{ticket.employee}</span>
                        </>
                      )}
                      <span>|</span>
                      <FiClock className="w-3 h-3" />
                      <span>{getTimeToResponse(ticket.createdAt, ticket.firstResponseAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <Badge variant={severityColors[ticket.severity as keyof typeof severityColors] as 'gray' | 'amber' | 'red'} size="sm">
                      {ticket.severity}
                    </Badge>
                  </div>
                  <Badge variant={statusColors[ticket.status as keyof typeof statusColors] as 'amber' | 'blue' | 'green' | 'gray'}>
                    {ticket.status.replace('_', ' ')}
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
