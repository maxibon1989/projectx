'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiLayers, FiClock } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

// Plan list page
export default function PlanListPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const plans = [
    {
      id: 'p1',
      name: 'Unbound Standard',
      version: 1,
      status: 'draft',
      equivalenceStatus: 'amber',
      createdAt: '2024-01-20',
    },
    {
      id: 'p2',
      name: 'Unbound Standard',
      version: 2,
      status: 'published',
      equivalenceStatus: 'green',
      createdAt: '2024-02-01',
    },
  ];

  return (
    <PageLayout title="Plans">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Design benefit plans that match or exceed your baseline.
          </p>
          <Button href={`/company/${companyId}/plan/new`}>
            <FiPlus className="w-4 h-4 mr-2" />
            New Plan
          </Button>
        </div>

        <div className="space-y-4">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/company/${companyId}/plan/${plan.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FiLayers className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{plan.name} v{plan.version}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span>Created {plan.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={plan.equivalenceStatus === 'green' ? 'green' : 'amber'}>
                      Equivalence: {plan.equivalenceStatus}
                    </Badge>
                    <Badge variant={plan.status === 'published' ? 'blue' : 'gray'}>
                      {plan.status}
                    </Badge>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
