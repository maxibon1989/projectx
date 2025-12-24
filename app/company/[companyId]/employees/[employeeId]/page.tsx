'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FiMail, FiRefreshCw, FiDollarSign, FiShield, FiCreditCard, FiFileText, FiMessageCircle, FiCheck, FiClock } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 6: Employee Detail
type Tab = 'overview' | 'timeline' | 'documents' | 'support';

export default function EmployeeDetailPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const employeeId = params.employeeId as string;

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const employee = {
    id: employeeId,
    name: 'Anna Svensson',
    email: 'anna@company.com',
    roleGroup: 'Engineering',
    status: 'enrolled',
    salary: 45000,
    startDate: '2022-03-15',
    pensionBalance: 125000,
    contributionsLastMonth: 2475,
    walletBalance: 3500,
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'timeline', label: 'Enrollment Timeline' },
    { key: 'documents', label: 'Documents' },
    { key: 'support', label: 'Support History' },
  ];

  const timeline = [
    { step: 'Invited', date: '2024-01-15', completed: true },
    { step: 'Account created', date: '2024-01-16', completed: true },
    { step: 'Info reviewed', date: '2024-01-17', completed: true },
    { step: 'Choices made', date: '2024-01-18', completed: true },
    { step: 'Documents signed', date: '2024-01-19', completed: true },
    { step: 'Enrolled', date: '2024-01-20', completed: true },
  ];

  return (
    <PageLayout title={employee.name}>
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'enrollment', id: 'en1', label: 'Enrollment', href: '#' },
            { type: 'policy_document', id: 'd1', label: 'Policy Pack', href: '/docs/d1' },
            { type: 'ticket', id: 't1', label: 'Ticket #123', href: '/support/tickets/t1' },
          ]}
        />

        {/* Header */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-semibold text-primary">
                  {employee.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{employee.name}</h2>
                  <p className="text-gray-500">{employee.roleGroup} | {employee.email}</p>
                  <p className="text-sm text-gray-400">Started {employee.startDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="green" size="lg">Enrolled</Badge>
                <Button variant="outline" size="sm">
                  <FiMail className="w-4 h-4 mr-2" />
                  Send Invite
                </Button>
                <Button variant="outline" size="sm">
                  <FiRefreshCw className="w-4 h-4 mr-2" />
                  Resend Onboarding
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as Tab)}
              className={`px-4 py-2 border-b-2 ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contributions */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FiDollarSign className="w-5 h-5" />
                  Contributions
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Pension balance</span>
                    <span className="font-medium">{employee.pensionBalance.toLocaleString()} SEK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Last month</span>
                    <span className="font-medium text-green-600">+{employee.contributionsLastMonth.toLocaleString()} SEK</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Salary exchange</span>
                    <Badge variant="green">Active</Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Coverages */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FiShield className="w-5 h-5" />
                  Coverages
                </h3>
                <div className="space-y-3">
                  {[
                    { name: 'Life Insurance', level: '3x salary', active: true },
                    { name: 'Disability', level: '80%', active: true },
                    { name: 'Occupational Injury', level: 'Enhanced', active: true },
                  ].map((coverage) => (
                    <div key={coverage.name} className="flex justify-between items-center">
                      <span className="text-gray-500">{coverage.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{coverage.level}</span>
                        <Badge variant={coverage.active ? 'green' : 'gray'} size="sm">
                          {coverage.active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Benefits Wallet */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FiCreditCard className="w-5 h-5" />
                  Benefits Wallet
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Remaining balance</span>
                    <span className="font-medium">{employee.walletBalance.toLocaleString()} SEK</span>
                  </div>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-gray-500 mb-2">Allocations</p>
                    <div className="space-y-2">
                      {[
                        { category: 'Wellness', amount: 1000 },
                        { category: 'Training', amount: 500 },
                      ].map((alloc) => (
                        <div key={alloc.category} className="flex justify-between text-sm">
                          <span>{alloc.category}</span>
                          <span>{alloc.amount} SEK</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Missing Signatures */}
            <Card>
              <div className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <FiFileText className="w-5 h-5" />
                  Signatures
                </h3>
                <div className="space-y-3">
                  {[
                    { doc: 'Employment Addendum', signed: true },
                    { doc: 'Pension Agreement', signed: true },
                    { doc: 'Insurance Consent', signed: true },
                  ].map((doc) => (
                    <div key={doc.doc} className="flex justify-between items-center">
                      <span className="text-gray-500">{doc.doc}</span>
                      <Badge variant={doc.signed ? 'green' : 'amber'} size="sm">
                        {doc.signed ? 'Signed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'timeline' && (
          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-6">Enrollment Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                  {timeline.map((event, i) => (
                    <div key={event.step} className="relative pl-10">
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        event.completed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {event.completed ? (
                          <FiCheck className="w-4 h-4 text-green-600" />
                        ) : (
                          <FiClock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{event.step}</p>
                        <p className="text-sm text-gray-500">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'documents' && (
          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-4">Documents</h3>
              <div className="space-y-3">
                {[
                  { name: 'Policy Pack', type: 'PDF', date: '2024-01-20' },
                  { name: 'Employee FAQ', type: 'PDF', date: '2024-01-20' },
                  { name: 'Signed Addendum', type: 'PDF', date: '2024-01-19' },
                ].map((doc) => (
                  <div key={doc.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FiFileText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.date}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'support' && (
          <Card>
            <div className="p-6">
              <h3 className="font-semibold mb-4">Support History</h3>
              <div className="space-y-3">
                {[
                  { id: 't1', title: 'Question about salary exchange', status: 'resolved', date: '2024-01-25' },
                ].map((ticket) => (
                  <a
                    key={ticket.id}
                    href={`/support/tickets/${ticket.id}`}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <FiMessageCircle className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-gray-500">{ticket.date}</p>
                      </div>
                    </div>
                    <Badge variant="green">{ticket.status}</Badge>
                  </a>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
