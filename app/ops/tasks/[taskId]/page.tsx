'use client';

import { useParams } from 'next/navigation';
import { FiClock, FiUser, FiFileText, FiUpload, FiMail, FiCheckSquare } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 9: Task Detail
export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.taskId as string;

  const task = {
    id: taskId,
    title: 'Request pension provider quote',
    description: 'Contact pension providers to get quotes for the new plan design.',
    stage: 'provider_setup',
    status: 'in_progress',
    priority: 'high',
    owner: 'Erik Lindberg',
    dueDate: '2024-02-15',
    createdAt: '2024-02-01',
    spawnedFrom: { type: 'audit_gap', id: 'g1', label: 'Pension fee optimization' },
    history: [
      { action: 'Task created from audit gap', by: 'System', date: '2024-02-01' },
      { action: 'Assigned to Erik Lindberg', by: 'Anna S.', date: '2024-02-02' },
      { action: 'Started work', by: 'Erik L.', date: '2024-02-05' },
    ],
    nextSteps: [
      'Contact Avanza for quote',
      'Contact SPP for quote',
      'Compare offers and document findings',
    ],
    emailTemplate: `Subject: Request for Pension Provider Quote

Dear [Provider],

We are evaluating pension solutions for our company and would like to request a formal quote.

Company: [Company Name]
Employees: [X]
Current setup: [Details]

Please provide:
1. Fee structure (monthly/annually)
2. Fund options available
3. Implementation timeline
4. Support services included

Best regards,
[Name]`,
    checklistTemplate: [
      'Gather company details',
      'Identify 3+ providers',
      'Send quote requests',
      'Collect responses',
      'Create comparison matrix',
      'Present to stakeholders',
    ],
  };

  return (
    <PageLayout title="Task Details">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'audit_report', id: 'a1', label: 'Audit v1', href: '/company/c1/audit/a1' },
            { type: 'company', id: 'c1', label: 'Acme AB', href: '/company/c1/home' },
          ]}
        />

        {/* Header */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="gray">{task.stage.replace('_', ' ')}</Badge>
                  <Badge variant="amber">{task.priority} priority</Badge>
                </div>
                <h1 className="text-xl font-semibold">{task.title}</h1>
                <p className="text-gray-600 mt-1">{task.description}</p>
              </div>
              <Badge variant="blue" size="lg">{task.status.replace('_', ' ')}</Badge>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Assigned to</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <FiUser className="w-4 h-4" />
                  {task.owner}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Due date</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <FiClock className="w-4 h-4" />
                  {task.dueDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium mt-1">{task.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Spawned from</p>
                <a href="#" className="text-primary hover:underline text-sm mt-1 block">
                  {task.spawnedFrom.label}
                </a>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* What Happened */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-4">What Happened</h3>
              <div className="space-y-4">
                {task.history.map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-2 h-2 mt-2 rounded-full bg-gray-300" />
                    <div>
                      <p>{event.action}</p>
                      <p className="text-sm text-gray-500">{event.by} | {event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* What to Do Next */}
          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-4">What to Do Next</h3>
              <div className="space-y-3">
                {task.nextSteps.map((step, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" className="rounded" />
                    <span>{step}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Templates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FiMail className="w-5 h-5" />
                Email Template
              </h3>
              <pre className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap font-mono overflow-auto max-h-64">
                {task.emailTemplate}
              </pre>
              <Button variant="outline" className="mt-4">
                Copy Template
              </Button>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <FiCheckSquare className="w-5 h-5" />
                Checklist Template
              </h3>
              <div className="space-y-2">
                {task.checklistTemplate.map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                    <input type="checkbox" className="rounded" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Evidence Uploads */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiFileText className="w-5 h-5" />
              Evidence Uploads
            </h3>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <FiUpload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-3">
                Drag and drop files here, or click to browse
              </p>
              <Button variant="outline">Upload Evidence</Button>
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button>Mark as Complete</Button>
          <Button variant="outline">Reassign</Button>
          <Button variant="outline">Add Note</Button>
        </div>
      </div>
    </PageLayout>
  );
}
