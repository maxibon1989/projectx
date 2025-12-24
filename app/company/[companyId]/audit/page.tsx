'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiFileText, FiClock } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

// Audit list page
export default function AuditListPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  // Mock data
  const audits = [
    {
      id: 'a1',
      version: 1,
      status: 'completed',
      confidenceScore: 85,
      createdAt: '2024-01-15',
      completedAt: '2024-01-20',
    },
    {
      id: 'a2',
      version: 2,
      status: 'in_progress',
      confidenceScore: 45,
      createdAt: '2024-02-01',
      completedAt: null,
    },
  ];

  return (
    <PageLayout title="Audits">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Audits analyze your current benefits setup and identify optimization opportunities.
          </p>
          <Button href={`/company/${companyId}/audit/new`}>
            <FiPlus className="w-4 h-4 mr-2" />
            New Audit
          </Button>
        </div>

        <div className="space-y-4">
          {audits.map((audit) => (
            <Link key={audit.id} href={`/company/${companyId}/audit/${audit.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FiFileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Audit v{audit.version}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span>Created {audit.createdAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Confidence</div>
                      <div className="font-medium">{audit.confidenceScore}%</div>
                    </div>
                    <Badge variant={audit.status === 'completed' ? 'green' : 'amber'}>
                      {audit.status === 'completed' ? 'Completed' : 'In Progress'}
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
