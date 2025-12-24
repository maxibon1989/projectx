'use client';

import { useParams } from 'next/navigation';
import { FiDatabase, FiDollarSign, FiEdit3, FiBookOpen, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 13: Integrations - Show path to scale
export default function IntegrationsPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const integrations = [
    {
      type: 'payroll',
      label: 'Payroll Systems',
      icon: <FiDatabase className="w-6 h-6" />,
      providers: [
        { name: 'Visma', status: 'live', dataPulled: ['Employee data', 'Salary info'], dataPushed: ['Contribution deductions'], limitations: ['Manual export for some fields'] },
        { name: 'Fortnox', status: 'beta', dataPulled: ['Employee data'], dataPushed: [], limitations: ['Read-only access', 'API rate limits'] },
        { name: 'Other', status: 'planned', dataPulled: [], dataPushed: [], limitations: [] },
      ],
    },
    {
      type: 'pension',
      label: 'Pension Providers',
      icon: <FiDollarSign className="w-6 h-6" />,
      providers: [
        { name: 'Avanza', status: 'live', dataPulled: ['Account balances', 'Transactions'], dataPushed: ['Contribution instructions'], limitations: [] },
        { name: 'SPP', status: 'beta', dataPulled: ['Policy status'], dataPushed: [], limitations: ['Limited API access'] },
      ],
    },
    {
      type: 'e_signing',
      label: 'E-Signing',
      icon: <FiEdit3 className="w-6 h-6" />,
      providers: [
        { name: 'BankID', status: 'live', dataPulled: [], dataPushed: ['Document signatures'], limitations: [] },
        { name: 'Scrive', status: 'planned', dataPulled: [], dataPushed: [], limitations: [] },
      ],
    },
    {
      type: 'accounting',
      label: 'Accounting',
      icon: <FiBookOpen className="w-6 h-6" />,
      providers: [
        { name: 'Fortnox', status: 'planned', dataPulled: [], dataPushed: [], limitations: [] },
        { name: 'Visma', status: 'planned', dataPulled: [], dataPushed: [], limitations: [] },
      ],
    },
  ];

  const statusColors = {
    live: 'green',
    beta: 'amber',
    planned: 'gray',
    deprecated: 'red',
  };

  return (
    <PageLayout title="Integrations">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'task', id: 't1', label: 'Blocked by Fortnox', href: '/ops/tasks/t1' },
          ]}
        />

        {/* Header */}
        <div>
          <p className="text-gray-600">Connect your existing systems to Unbound.</p>
          <p className="text-sm text-gray-400">Show path to scale without building it now.</p>
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.type}>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {integration.icon}
                  </div>
                  <h3 className="font-semibold">{integration.label}</h3>
                </div>

                <div className="space-y-4">
                  {integration.providers.map((provider) => (
                    <div key={provider.name} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{provider.name}</span>
                        <Badge variant={statusColors[provider.status as keyof typeof statusColors] as 'green' | 'amber' | 'gray' | 'red'}>
                          {provider.status}
                        </Badge>
                      </div>

                      {provider.status !== 'planned' && (
                        <div className="space-y-2 text-sm">
                          {provider.dataPulled.length > 0 && (
                            <div>
                              <span className="text-gray-500">Data pulled: </span>
                              <span>{provider.dataPulled.join(', ')}</span>
                            </div>
                          )}
                          {provider.dataPushed.length > 0 && (
                            <div>
                              <span className="text-gray-500">Data pushed: </span>
                              <span>{provider.dataPushed.join(', ')}</span>
                            </div>
                          )}
                          {provider.limitations.length > 0 && (
                            <div className="text-amber-600">
                              <span>Limitations: </span>
                              <span>{provider.limitations.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {provider.status === 'live' && (
                        <Button size="sm" variant="outline" className="mt-3">
                          Configure
                        </Button>
                      )}
                      {provider.status === 'beta' && (
                        <Button size="sm" variant="outline" className="mt-3">
                          Request Access
                        </Button>
                      )}
                      {provider.status === 'planned' && (
                        <Button size="sm" variant="ghost" className="mt-3" disabled>
                          Coming Soon
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card>
          <div className="p-6 text-center">
            <FiHelpCircle className="w-8 h-8 mx-auto mb-3 text-gray-400" />
            <h3 className="font-semibold mb-2">Need a different integration?</h3>
            <p className="text-gray-600 text-sm mb-4">
              Contact our team to discuss custom integration options.
            </p>
            <Button variant="outline">
              Contact Support
              <FiArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
