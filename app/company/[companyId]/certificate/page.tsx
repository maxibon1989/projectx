'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiAward, FiClock, FiCheck } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

// Certificate list page
export default function CertificateListPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const certificates = [
    {
      id: 'c1',
      name: 'Unbound Standard Certificate',
      version: 1,
      status: 'signed',
      effectiveDate: '2024-02-01',
      planVersion: 2,
    },
  ];

  return (
    <PageLayout title="Certificates">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Certificates prove equivalence between your plan and baseline requirements.
          </p>
          <Button href={`/company/${companyId}/certificate/new`}>
            <FiPlus className="w-4 h-4 mr-2" />
            New Certificate
          </Button>
        </div>

        <div className="space-y-4">
          {certificates.map((cert) => (
            <Link key={cert.id} href={`/company/${companyId}/certificate/${cert.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <FiAward className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{cert.name} v{cert.version}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FiClock className="w-4 h-4" />
                        <span>Effective {cert.effectiveDate}</span>
                        <span className="text-gray-300">|</span>
                        <span>Based on Plan v{cert.planVersion}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="green">
                    <FiCheck className="w-3 h-3 mr-1" />
                    Signed
                  </Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
