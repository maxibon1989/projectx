'use client';

import { useParams } from 'next/navigation';
import { FiBuilding, FiUsers, FiLock, FiBell, FiDatabase } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Input, Select, Badge } from '@/components/ui';

// Settings page
export default function SettingsPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const stakeholders = [
    { name: 'Anna Johansson', email: 'anna@company.com', role: 'ceo', status: 'active' },
    { name: 'Erik Lindberg', email: 'erik@company.com', role: 'cfo', status: 'active' },
    { name: 'Maria Svensson', email: 'maria@company.com', role: 'hr', status: 'pending' },
  ];

  return (
    <PageLayout title="Settings">
      <div className="space-y-6">
        {/* Company Profile */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiBuilding className="w-5 h-5" />
              Company Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Legal name" defaultValue="Acme AB" />
              <Input label="Org number" defaultValue="556123-4567" />
              <Input label="Sector" defaultValue="Technology" />
              <Input label="Headcount" type="number" defaultValue="52" />
              <Select
                label="Union status"
                defaultValue="no_agreement"
                options={[
                  { value: 'no_agreement', label: 'No agreement' },
                  { value: 'agreement', label: 'Agreement' },
                  { value: 'agreement_like', label: 'Agreement-like' },
                ]}
              />
              <Select
                label="Payroll system"
                defaultValue="visma"
                options={[
                  { value: 'visma', label: 'Visma' },
                  { value: 'fortnox', label: 'Fortnox' },
                  { value: 'other', label: 'Other' },
                ]}
              />
            </div>
            <Button className="mt-4">Save Changes</Button>
          </div>
        </Card>

        {/* Stakeholders */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FiUsers className="w-5 h-5" />
                Stakeholders
              </h3>
              <Button variant="outline" size="sm">Invite</Button>
            </div>
            <div className="space-y-3">
              {stakeholders.map((person) => (
                <div key={person.email} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{person.name}</p>
                    <p className="text-sm text-gray-500">{person.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="gray">{person.role.toUpperCase()}</Badge>
                    <Badge variant={person.status === 'active' ? 'green' : 'amber'}>
                      {person.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiLock className="w-5 h-5" />
              Security
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Two-factor authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for all stakeholders</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Session timeout</p>
                  <p className="text-sm text-gray-500">Auto-logout after inactivity</p>
                </div>
                <select className="p-2 border rounded">
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>4 hours</option>
                </select>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiBell className="w-5 h-5" />
              Notifications
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Audit complete', description: 'When an audit is finalized' },
                { label: 'Employee enrolled', description: 'When employees complete enrollment' },
                { label: 'Drift alerts', description: 'Compliance issues detected' },
                { label: 'Task reminders', description: 'Daily summary of pending tasks' },
              ].map((notif) => (
                <div key={notif.label} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{notif.label}</p>
                    <p className="text-sm text-gray-500">{notif.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Data */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiDatabase className="w-5 h-5" />
              Data Management
            </h3>
            <div className="space-y-4">
              <Button variant="outline">Export All Data</Button>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Delete Company Data
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
