'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiPlus, FiFileText, FiFolder, FiDownload, FiCalendar } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';

// Page 11: Documents
export default function DocumentsPage() {
  const [activeFolder, setActiveFolder] = useState<string>('all');

  const folders = [
    { key: 'all', label: 'All Documents', count: 12 },
    { key: 'board_pack', label: 'Board Pack', count: 3 },
    { key: 'employee_pack', label: 'Employee Pack', count: 4 },
    { key: 'provider_pack', label: 'Provider Pack', count: 3 },
    { key: 'legal_pack', label: 'Legal Pack', count: 2 },
  ];

  const documents = [
    { id: 'd1', title: 'Board Summary Q1 2024', type: 'board_summary', folder: 'board_pack', generatedFrom: 'Audit v1', date: '2024-02-01' },
    { id: 'd2', title: 'Freedom Audit Report', type: 'audit_report', folder: 'board_pack', generatedFrom: 'Audit v1', date: '2024-01-20' },
    { id: 'd3', title: 'Equivalence Certificate v1', type: 'certificate', folder: 'board_pack', generatedFrom: 'Certificate v1', date: '2024-02-05' },
    { id: 'd4', title: 'Employee Truth Sheet', type: 'employee_truth_sheet', folder: 'employee_pack', generatedFrom: 'Plan v2', date: '2024-02-01' },
    { id: 'd5', title: 'Benefits FAQ', type: 'faq', folder: 'employee_pack', generatedFrom: 'Plan v2', date: '2024-02-01' },
    { id: 'd6', title: 'Pension Policy Terms', type: 'policy_addendum', folder: 'provider_pack', generatedFrom: null, date: '2024-01-15' },
    { id: 'd7', title: 'Insurance Agreement', type: 'policy_addendum', folder: 'provider_pack', generatedFrom: null, date: '2024-01-15' },
    { id: 'd8', title: 'Employment Addendum Template', type: 'policy_addendum', folder: 'legal_pack', generatedFrom: 'Plan v2', date: '2024-02-01' },
  ];

  const filteredDocs = activeFolder === 'all'
    ? documents
    : documents.filter((d) => d.folder === activeFolder);

  const typeLabels: Record<string, string> = {
    board_summary: 'Board Summary',
    audit_report: 'Audit Report',
    certificate: 'Certificate',
    employee_truth_sheet: 'Truth Sheet',
    faq: 'FAQ',
    policy_addendum: 'Policy',
    union_pack: 'Union Pack',
    uploaded_evidence: 'Evidence',
  };

  return (
    <PageLayout title="Documents">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <p className="text-gray-600">
            Every promise must be downloadable.
          </p>
          <Button>
            <FiPlus className="w-4 h-4 mr-2" />
            Upload Document
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Folders */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-3">Folders</h3>
                <div className="space-y-1">
                  {folders.map((folder) => (
                    <button
                      key={folder.key}
                      onClick={() => setActiveFolder(folder.key)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left ${
                        activeFolder === folder.key
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FiFolder className="w-4 h-4" />
                        <span>{folder.label}</span>
                      </div>
                      <Badge variant="gray" size="sm">{folder.count}</Badge>
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Document List */}
          <div className="lg:col-span-3">
            <Card>
              <div className="divide-y">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FiFileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <Link
                          href={`/docs/${doc.id}`}
                          className="font-medium hover:text-primary"
                        >
                          {doc.title}
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Badge variant="gray" size="sm">{typeLabels[doc.type] || doc.type}</Badge>
                          <span>|</span>
                          <FiCalendar className="w-3 h-3" />
                          <span>{doc.date}</span>
                          {doc.generatedFrom && (
                            <>
                              <span>|</span>
                              <span>From {doc.generatedFrom}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FiDownload className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
