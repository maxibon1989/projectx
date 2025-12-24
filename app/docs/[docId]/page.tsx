'use client';

import { useParams } from 'next/navigation';
import { FiDownload, FiExternalLink, FiCalendar, FiUser, FiLink } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 11: Document Detail
export default function DocumentDetailPage() {
  const params = useParams();
  const docId = params.docId as string;

  const document = {
    id: docId,
    title: 'Employee Truth Sheet',
    type: 'employee_truth_sheet',
    folder: 'employee_pack',
    fileName: 'employee_truth_sheet_v1.pdf',
    fileUrl: '#',
    mimeType: 'application/pdf',
    version: 1,
    createdAt: '2024-02-01',
    createdBy: 'System',
    generatedFrom: {
      auditReportId: 'a1',
      planVersionId: 'p2',
      certificateVersionId: null,
    },
    relatedEmployees: ['All employees'],
  };

  return (
    <PageLayout title="Document">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'audit_report', id: 'a1', label: 'Audit v1', href: '/company/c1/audit/a1' },
            { type: 'plan_version', id: 'p2', label: 'Plan v2', href: '/company/c1/plan/p2' },
          ]}
        />

        {/* Document Info */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge variant="gray" className="mb-2">{document.folder.replace('_', ' ')}</Badge>
                <h1 className="text-xl font-semibold">{document.title}</h1>
                <p className="text-gray-500 mt-1">{document.fileName}</p>
              </div>
              <Button>
                <FiDownload className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Version</p>
                <p className="font-medium mt-1">v{document.version}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <FiCalendar className="w-4 h-4" />
                  {document.createdAt}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created by</p>
                <p className="font-medium flex items-center gap-2 mt-1">
                  <FiUser className="w-4 h-4" />
                  {document.createdBy}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Type</p>
                <p className="font-medium mt-1">{document.type.replace(/_/g, ' ')}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Generated From */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Generated From</h3>
            <div className="space-y-3">
              {document.generatedFrom.auditReportId && (
                <a
                  href={`/company/c1/audit/${document.generatedFrom.auditReportId}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <FiLink className="w-4 h-4 text-gray-400" />
                    <span>Audit Report</span>
                  </div>
                  <FiExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              )}
              {document.generatedFrom.planVersionId && (
                <a
                  href={`/company/c1/plan/${document.generatedFrom.planVersionId}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <FiLink className="w-4 h-4 text-gray-400" />
                    <span>Plan Version</span>
                  </div>
                  <FiExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              )}
              {document.generatedFrom.certificateVersionId && (
                <a
                  href={`/company/c1/certificate/${document.generatedFrom.certificateVersionId}`}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <FiLink className="w-4 h-4 text-gray-400" />
                    <span>Certificate</span>
                  </div>
                  <FiExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              )}
            </div>
          </div>
        </Card>

        {/* Preview Placeholder */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Preview</h3>
            <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="mb-2">PDF Preview</p>
                <Button variant="outline" size="sm">
                  <FiExternalLink className="w-4 h-4 mr-2" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
