'use client';

import { useParams } from 'next/navigation';
import { FiCheck, FiX, FiExternalLink, FiDownload, FiFileText, FiUser } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 5: Certificate - Equivalence Mapping
export default function CertificatePage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const certId = params.certId as string;

  const requirements = [
    {
      id: '1',
      requirement: 'Pension contribution minimum',
      baselineSource: 'CBA',
      baselineLevel: '4.5%',
      unboundLevel: '5.5%',
      providerPolicyId: 'pp1',
      status: 'exceeds',
    },
    {
      id: '2',
      requirement: 'Life insurance coverage',
      baselineSource: 'Internal Policy',
      baselineLevel: '3x annual salary',
      unboundLevel: '3x annual salary',
      providerPolicyId: 'pp2',
      status: 'meets',
    },
    {
      id: '3',
      requirement: 'Disability coverage',
      baselineSource: 'Law',
      baselineLevel: '80% salary',
      unboundLevel: '80% salary',
      providerPolicyId: 'pp2',
      status: 'meets',
    },
    {
      id: '4',
      requirement: 'Occupational injury',
      baselineSource: 'Law',
      baselineLevel: 'Standard TFA',
      unboundLevel: 'Enhanced TFA',
      providerPolicyId: 'pp3',
      status: 'exceeds',
    },
    {
      id: '5',
      requirement: 'Parental top-up',
      baselineSource: 'Internal Policy',
      baselineLevel: 'None',
      unboundLevel: '5000 SEK/month',
      providerPolicyId: null,
      status: 'exceeds',
    },
    {
      id: '6',
      requirement: 'Sickness top-up',
      baselineSource: 'CBA',
      baselineLevel: '10% for 90 days',
      unboundLevel: '10% for 90 days',
      providerPolicyId: null,
      status: 'meets',
    },
    {
      id: '7',
      requirement: 'Work injury reporting',
      baselineSource: 'Law',
      baselineLevel: 'Required',
      unboundLevel: 'Automated',
      providerPolicyId: null,
      status: 'exceeds',
    },
  ];

  const signatories = [
    { role: 'Company Approver', name: 'Anna Johansson', title: 'CEO', signed: true, date: '2024-02-01' },
    { role: 'Unbound Reviewer', name: 'Erik Lindberg', title: 'Compliance Lead', signed: true, date: '2024-02-01' },
    { role: 'External Counsel', name: null, title: null, signed: false, date: null },
  ];

  return (
    <PageLayout title={certId === 'new' ? 'New Certificate' : 'Equivalence Certificate'}>
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'plan_version', id: 'p2', label: 'Plan v2', href: `/company/${companyId}/plan/p2` },
            { type: 'audit_report', id: 'a1', label: 'Audit v1', href: `/company/${companyId}/audit/a1` },
            { type: 'policy_document', id: 'd1', label: 'Certificate PDF', href: '/docs/d1' },
          ]}
        />

        {/* Certificate Header */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Unbound Standard Certificate</h2>
                <p className="text-gray-500">Version 1 | Effective: 2024-02-01</p>
              </div>
              <Badge variant="green" size="lg">
                <FiCheck className="w-4 h-4 mr-1" />
                Signed
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {signatories.map((sig) => (
                <div key={sig.role} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">{sig.role}</span>
                  </div>
                  {sig.name ? (
                    <>
                      <p className="font-medium">{sig.name}</p>
                      <p className="text-sm text-gray-500">{sig.title}</p>
                      {sig.signed && (
                        <p className="text-xs text-green-600 mt-1">Signed {sig.date}</p>
                      )}
                    </>
                  ) : (
                    <p className="text-gray-400 italic">Optional - not assigned</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Requirements Table */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Requirements Mapping</h3>
            <p className="text-sm text-gray-500 mb-4">
              This certificate is only as good as the evidence attached.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="pb-3 font-medium">Requirement</th>
                    <th className="pb-3 font-medium">Source</th>
                    <th className="pb-3 font-medium">Baseline</th>
                    <th className="pb-3 font-medium">Unbound</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Evidence</th>
                  </tr>
                </thead>
                <tbody>
                  {requirements.map((req) => (
                    <tr key={req.id} className="border-b">
                      <td className="py-4">
                        <a
                          href={`/company/${companyId}/plan/p2?module=${req.requirement.toLowerCase().replace(' ', '_')}`}
                          className="text-primary hover:underline"
                        >
                          {req.requirement}
                        </a>
                      </td>
                      <td className="py-4">
                        <Badge variant="gray" size="sm">{req.baselineSource}</Badge>
                      </td>
                      <td className="py-4">{req.baselineLevel}</td>
                      <td className="py-4 font-medium">{req.unboundLevel}</td>
                      <td className="py-4">
                        <Badge
                          variant={req.status === 'exceeds' ? 'green' : req.status === 'meets' ? 'blue' : 'red'}
                          size="sm"
                        >
                          {req.status === 'exceeds' && <FiCheck className="w-3 h-3 mr-1" />}
                          {req.status === 'missing' && <FiX className="w-3 h-3 mr-1" />}
                          {req.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {req.providerPolicyId ? (
                          <a
                            href={`/docs/${req.providerPolicyId}`}
                            className="inline-flex items-center text-primary hover:underline text-sm"
                          >
                            <FiExternalLink className="w-3 h-3 mr-1" />
                            Policy
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">Internal</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Attachments */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Attachments</h3>
            <div className="space-y-2">
              {[
                { name: 'Pension Policy - Unbound', type: 'PDF' },
                { name: 'Insurance Terms - Euro Accident', type: 'PDF' },
                { name: 'Plan Summary', type: 'PDF' },
                { name: 'Employee FAQ', type: 'PDF' },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FiFileText className="w-5 h-5 text-gray-400" />
                    <span>{doc.name}</span>
                    <Badge variant="gray" size="sm">{doc.type}</Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <FiDownload className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button>
            <FiDownload className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline">
            Generate Employee Truth Sheet
          </Button>
          <Button variant="outline">
            Generate Union Conversation Pack
          </Button>
        </div>
      </div>
    </PageLayout>
  );
}
