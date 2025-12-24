'use client';

import { useParams } from 'next/navigation';
import { FiCheckCircle, FiAlertTriangle, FiCalendar, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 12: Monitoring - Continuous compliance co-pilot
export default function MonitoringPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const monthlyChecks = {
    month: 'February 2024',
    contributionsReceived: true,
    policiesActive: true,
    enrollmentsOk: false,
  };

  const driftAlerts = [
    {
      id: 'da1',
      type: 'missing_coverage',
      employee: 'Johan Berg',
      description: 'Life insurance coverage not confirmed',
      severity: 'warning',
      createdAt: '2024-02-08',
    },
    {
      id: 'da2',
      type: 'contribution_mismatch',
      employee: 'Lisa Karlsson',
      description: 'Pension contribution 500 SEK lower than expected',
      severity: 'error',
      createdAt: '2024-02-05',
    },
  ];

  const renewals = [
    { id: 'r1', provider: 'Euro Accident', policy: 'Group Insurance', expiryDate: '2024-06-30', daysUntil: 140 },
    { id: 'r2', provider: 'SPP', policy: 'Pension Agreement', expiryDate: '2024-12-31', daysUntil: 324 },
  ];

  return (
    <PageLayout title="Monitoring">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'provider_policy', id: 'pp1', label: 'Euro Accident Policy', href: '#' },
            { type: 'employee', id: 'e3', label: 'Johan Berg', href: `/company/${companyId}/employees/e3` },
          ]}
        />

        {/* Intro */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Continuous compliance co-pilot.</p>
            <p className="text-sm text-gray-400">If we miss a contribution, you see it here first.</p>
          </div>
          <Button variant="outline">
            <FiRefreshCw className="w-4 h-4 mr-2" />
            Run Check
          </Button>
        </div>

        {/* Monthly Checklist */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Monthly Checklist - {monthlyChecks.month}</h3>
            <div className="space-y-3">
              {[
                { key: 'contributionsReceived', label: 'Contributions received', status: monthlyChecks.contributionsReceived },
                { key: 'policiesActive', label: 'Policies active', status: monthlyChecks.policiesActive },
                { key: 'enrollmentsOk', label: 'Enrollments complete', status: monthlyChecks.enrollmentsOk },
              ].map((check) => (
                <div key={check.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span>{check.label}</span>
                  {check.status ? (
                    <Badge variant="green">
                      <FiCheckCircle className="w-3 h-3 mr-1" />
                      OK
                    </Badge>
                  ) : (
                    <Badge variant="amber">
                      <FiAlertTriangle className="w-3 h-3 mr-1" />
                      Needs attention
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Drift Detection */}
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Drift Detection</h3>
              <Badge variant="red">{driftAlerts.length} alerts</Badge>
            </div>
            <div className="space-y-3">
              {driftAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border ${
                    alert.severity === 'error' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <FiAlertTriangle className={`w-4 h-4 ${alert.severity === 'error' ? 'text-red-600' : 'text-amber-600'}`} />
                        <span className="font-medium">{alert.description}</span>
                      </div>
                      <p className="text-sm text-gray-600">Employee: {alert.employee} | {alert.createdAt}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <FiPlus className="w-3 h-3 mr-1" />
                      Create Task
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Upcoming Renewals */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Upcoming Renewals</h3>
            <div className="space-y-3">
              {renewals.map((renewal) => (
                <div key={renewal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{renewal.provider}</p>
                    <p className="text-sm text-gray-500">{renewal.policy}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm">
                      <FiCalendar className="w-4 h-4 text-gray-400" />
                      <span>{renewal.expiryDate}</span>
                    </div>
                    <Badge variant={renewal.daysUntil < 90 ? 'amber' : 'gray'} size="sm">
                      {renewal.daysUntil} days
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
