'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FiSend, FiUser, FiClock, FiLink } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 10: Ticket Detail
export default function TicketDetailPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  const [newMessage, setNewMessage] = useState('');

  const ticket = {
    id: ticketId,
    title: 'Question about salary exchange impact',
    source: 'employee_wallet',
    severity: 'low',
    status: 'open',
    employee: { id: 'e1', name: 'Anna Svensson' },
    assignee: 'Support Team',
    createdAt: '2024-02-10T10:30:00',
    linkedPlanModule: 'pension',
    linkedProviderPolicy: null,
    messages: [
      {
        id: 'm1',
        author: 'Anna Svensson',
        content: 'Hi, I enabled salary exchange last month but I am not sure how it affects my net salary. Can you explain?',
        timestamp: '2024-02-10T10:30:00',
        isInternal: false,
      },
      {
        id: 'm2',
        author: 'Support Bot',
        content: 'Thank you for reaching out! A team member will respond shortly. In the meantime, you can view your salary exchange settings in My Choices.',
        timestamp: '2024-02-10T10:30:05',
        isInternal: false,
      },
    ],
    resolutionCode: null,
    postMortemRequired: false,
  };

  const resolutionCodes = [
    { value: 'payroll', label: 'Payroll' },
    { value: 'pension', label: 'Pension' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <PageLayout title="Ticket Details">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'employee', id: ticket.employee.id, label: ticket.employee.name, href: `/company/c1/employees/${ticket.employee.id}` },
            { type: 'plan_version', id: 'p1', label: 'Pension Module', href: '/company/c1/plan/p1?module=pension' },
          ]}
        />

        {/* Header */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="gray">{ticket.source === 'employee_wallet' ? 'Employee Wallet' : 'Company Workspace'}</Badge>
                  <Badge variant="gray">{ticket.severity} severity</Badge>
                </div>
                <h1 className="text-xl font-semibold">{ticket.title}</h1>
              </div>
              <Badge variant="amber" size="lg">{ticket.status}</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Employee</p>
                <a href={`/company/c1/employees/${ticket.employee.id}`} className="text-primary hover:underline font-medium mt-1 block">
                  {ticket.employee.name}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <FiUser className="w-4 h-4" />
                  {ticket.assignee}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <FiClock className="w-4 h-4" />
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Related module</p>
                <a href="#" className="text-primary hover:underline flex items-center gap-1 mt-1">
                  <FiLink className="w-4 h-4" />
                  Pension
                </a>
              </div>
            </div>
          </div>
        </Card>

        {/* Thread */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Conversation</h3>
            <div className="space-y-4">
              {ticket.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg ${
                    msg.isInternal ? 'bg-amber-50 border border-amber-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{msg.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{msg.content}</p>
                  {msg.isInternal && (
                    <Badge variant="amber" size="sm" className="mt-2">Internal Note</Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <div className="mt-6 pt-4 border-t">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your response..."
                className="w-full p-4 border rounded-lg resize-none h-24"
              />
              <div className="flex items-center justify-between mt-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Internal note (not visible to employee)</span>
                </label>
                <Button>
                  <FiSend className="w-4 h-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Resolution */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Resolution</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Resolution Code</label>
                <select className="w-full p-2 border rounded-lg">
                  <option value="">Select code...</option>
                  {resolutionCodes.map((code) => (
                    <option key={code.value} value={code.value}>{code.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2 mt-8">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">Post-mortem required (critical error)</span>
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Resolution Notes</label>
              <textarea
                placeholder="Document how this was resolved..."
                className="w-full p-3 border rounded-lg resize-none h-20"
              />
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button>Resolve Ticket</Button>
          <Button variant="outline">Reassign</Button>
          <Button variant="outline">Escalate</Button>
        </div>
      </div>
    </PageLayout>
  );
}
