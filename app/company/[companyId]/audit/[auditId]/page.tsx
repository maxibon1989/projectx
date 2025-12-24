'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FiUsers, FiShield, FiLock, FiUpload, FiTrendingUp, FiAlertTriangle, FiDollarSign, FiActivity } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge, StatCard } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 2 & 3: Audit Intake Wizard & Results Dashboard
type AuditView = 'intake' | 'results';
type IntakeSection = 'workforce' | 'benefits' | 'constraints' | 'evidence';
type ResultsTab = 'executive' | 'cost_anatomy' | 'flexibility' | 'employee_upside' | 'gaps';

export default function AuditPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const auditId = params.auditId as string;

  const [view, setView] = useState<AuditView>('intake');
  const [currentSection, setCurrentSection] = useState<IntakeSection>('workforce');
  const [resultsTab, setResultsTab] = useState<ResultsTab>('executive');

  // Mock: check if audit is complete
  const isComplete = auditId !== 'new';

  const intakeSections = [
    { key: 'workforce', label: 'A. Workforce', icon: <FiUsers />, complete: true },
    { key: 'benefits', label: 'B. Current Benefits', icon: <FiShield />, complete: false },
    { key: 'constraints', label: 'C. Constraints', icon: <FiLock />, complete: false },
    { key: 'evidence', label: 'D. Evidence', icon: <FiUpload />, complete: false },
  ];

  const resultsTabs = [
    { key: 'executive', label: 'Executive' },
    { key: 'cost_anatomy', label: 'Cost Anatomy' },
    { key: 'flexibility', label: 'Flexibility Score' },
    { key: 'employee_upside', label: 'Employee Upside' },
    { key: 'gaps', label: 'Gaps' },
  ];

  return (
    <PageLayout title={auditId === 'new' ? 'New Audit' : `Audit v1`}>
      <div className="space-y-6">
        {/* Related objects */}
        {isComplete && (
          <RelatedChips
            links={[
              { type: 'company', id: companyId, label: 'Company', href: `/company/${companyId}/settings` },
              { type: 'policy_document', id: 'd1', label: 'Policy PDF', href: `/docs/d1` },
              { type: 'plan_version', id: 'p1', label: 'Plan v1', href: `/company/${companyId}/plan/p1` },
            ]}
          />
        )}

        {/* View Toggle (only for completed audits) */}
        {isComplete && (
          <div className="flex gap-2">
            <Button
              variant={view === 'intake' ? 'primary' : 'outline'}
              onClick={() => setView('intake')}
            >
              Intake Data
            </Button>
            <Button
              variant={view === 'results' ? 'primary' : 'outline'}
              onClick={() => setView('results')}
            >
              Results Dashboard
            </Button>
          </div>
        )}

        {/* INTAKE VIEW */}
        {view === 'intake' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Section Navigation */}
            <div className="lg:col-span-1">
              <Card>
                <div className="p-4 space-y-2">
                  {intakeSections.map((section) => (
                    <button
                      key={section.key}
                      onClick={() => setCurrentSection(section.key as IntakeSection)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                        currentSection === section.key
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {section.icon}
                      <span className="flex-1">{section.label}</span>
                      {section.complete && (
                        <Badge variant="green" size="sm">Done</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Live Preview */}
              <Card className="mt-4">
                <div className="p-4">
                  <h3 className="font-medium mb-3">Output Preview</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-500">Baseline estimate</span>
                      <p className="font-medium">~850,000 SEK/year</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Confidence score</span>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div className="bg-amber-500 h-2 rounded-full" style={{ width: '45%' }} />
                        </div>
                        <span className="font-medium">45%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Section Content */}
            <div className="lg:col-span-3">
              <Card>
                <div className="p-6">
                  {currentSection === 'workforce' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold">A. Workforce</h2>
                      <p className="text-gray-600">
                        Upload your employee list or add employees manually.
                      </p>
                      <div className="border-2 border-dashed rounded-lg p-8 text-center">
                        <FiUpload className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                        <p className="text-gray-600 mb-3">
                          Drag and drop your employee CSV, or click to browse
                        </p>
                        <Button variant="outline">Upload CSV</Button>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <span className="text-gray-600">Completeness</span>
                          <div className="flex items-center gap-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }} />
                            </div>
                            <span className="font-medium">80%</span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">Missing: fund fees, 3 role groups</span>
                      </div>
                    </div>
                  )}

                  {currentSection === 'benefits' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold">B. Current Benefits</h2>
                      <div className="space-y-4">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-3">Pension</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-600">Provider</label>
                              <input className="w-full mt-1 p-2 border rounded" placeholder="e.g., Avanza" />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Contribution %</label>
                              <input className="w-full mt-1 p-2 border rounded" placeholder="e.g., 4.5" type="number" />
                            </div>
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-3">Insurances</h3>
                          <p className="text-sm text-gray-500">Add current insurance policies with premiums if known.</p>
                          <Button variant="outline" className="mt-3">Add Insurance</Button>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-medium mb-3">Top-ups</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-gray-600">Parental top-up</label>
                              <input className="w-full mt-1 p-2 border rounded" placeholder="SEK/month" />
                            </div>
                            <div>
                              <label className="text-sm text-gray-600">Sickness top-up</label>
                              <input className="w-full mt-1 p-2 border rounded" placeholder="% of salary" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'constraints' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold">C. Constraints</h2>
                      <div className="space-y-4">
                        <div>
                          <label className="font-medium">Primary constraint</label>
                          <p className="text-sm text-gray-500 mb-3">Choose one main objective.</p>
                          <div className="space-y-2">
                            {[
                              { value: 'itp_like', label: 'Must mirror ITP-like coverage' },
                              { value: 'cost_neutral', label: 'Must be cost neutral' },
                              { value: 'employee_outcomes', label: 'Must improve employee outcomes' },
                            ].map((option) => (
                              <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="radio" name="constraint" value={option.value} />
                                <span>{option.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="font-medium">Red lines</label>
                          <p className="text-sm text-gray-500 mb-3">What absolutely cannot change?</p>
                          <div className="space-y-2">
                            {[
                              'Cannot change payroll vendor',
                              'Cannot change insurers',
                              'Cannot reduce pension contribution',
                            ].map((line) => (
                              <label key={line} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                                <input type="checkbox" />
                                <span>{line}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentSection === 'evidence' && (
                    <div className="space-y-6">
                      <h2 className="text-lg font-semibold">D. Evidence Uploads</h2>
                      <p className="text-gray-600">
                        Upload supporting documents to increase confidence score.
                      </p>
                      <div className="space-y-3">
                        {[
                          { type: 'Current policy PDFs', uploaded: true },
                          { type: 'Invoices or broker terms', uploaded: false },
                          { type: 'Union agreement document', uploaded: false },
                        ].map((doc) => (
                          <div key={doc.type} className="flex items-center justify-between p-4 border rounded-lg">
                            <span>{doc.type}</span>
                            {doc.uploaded ? (
                              <Badge variant="green">Uploaded</Badge>
                            ) : (
                              <Button variant="outline" size="sm">Upload</Button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <a href="#" className="text-primary hover:underline">What counts as equivalent?</a>
                        <a href="#" className="text-primary hover:underline">Invite your broker</a>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* RESULTS VIEW */}
        {view === 'results' && isComplete && (
          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b">
              {resultsTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setResultsTab(tab.key as ResultsTab)}
                  className={`px-4 py-2 border-b-2 ${
                    resultsTab === tab.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {resultsTab === 'executive' && (
              <div className="space-y-6">
                {/* 3 Key Numbers */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard
                    title="Total annual overhead"
                    value="850K SEK"
                    icon={<FiDollarSign className="w-5 h-5" />}
                    description="From benefits"
                  />
                  <StatCard
                    title="Avoidable fee drag"
                    value="45K SEK"
                    icon={<FiTrendingUp className="w-5 h-5" />}
                    trend={{ value: 5.3, isPositive: false }}
                  />
                  <StatCard
                    title="Compliance gaps"
                    value="3"
                    icon={<FiAlertTriangle className="w-5 h-5" />}
                    description="Need attention"
                  />
                </div>

                {/* Top 5 Moves */}
                <Card>
                  <div className="p-6">
                    <h3 className="font-semibold mb-4">Top 5 Moves</h3>
                    <div className="space-y-3">
                      {[
                        { title: 'Switch to low-fee pension funds', savings: '25K SEK/year', effort: 'Low' },
                        { title: 'Enable salary exchange', savings: '15K SEK/year', effort: 'Medium' },
                        { title: 'Consolidate insurance providers', savings: '10K SEK/year', effort: 'High' },
                        { title: 'Optimize parental top-up structure', savings: '8K SEK/year', effort: 'Low' },
                        { title: 'Review duplicate coverage', savings: '5K SEK/year', effort: 'Low' },
                      ].map((move, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{move.title}</p>
                            <p className="text-sm text-gray-500">Effort: {move.effort}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{move.savings}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>

                <div className="flex gap-4">
                  <Button>Export Board Summary</Button>
                  <Button variant="outline" href={`/company/${companyId}/plan/new?auditId=${auditId}`}>
                    Create Plan from Audit
                  </Button>
                </div>
              </div>
            )}

            {resultsTab === 'gaps' && (
              <div className="space-y-4">
                {[
                  {
                    title: 'Missing disability coverage documentation',
                    why: 'Employees may not understand their coverage in case of disability.',
                    risk: 'high',
                    fix: 'Upload current disability policy or request from provider.',
                  },
                  {
                    title: 'Pension fund fees not disclosed',
                    why: 'Hidden fees can reduce retirement outcomes by 15-20%.',
                    risk: 'medium',
                    fix: 'Request fee breakdown from pension provider.',
                  },
                  {
                    title: 'No salary exchange option',
                    why: 'Employees miss tax-efficient pension contributions.',
                    risk: 'low',
                    fix: 'Enable salary exchange in Plan Builder.',
                  },
                ].map((gap, i) => (
                  <Card key={i}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium">{gap.title}</h3>
                        <Badge variant={gap.risk === 'high' ? 'red' : gap.risk === 'medium' ? 'amber' : 'gray'}>
                          {gap.risk} risk
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{gap.why}</p>
                      <div className="flex items-center justify-between pt-3 border-t">
                        <span className="text-sm text-gray-500">Fix: {gap.fix}</span>
                        <Button size="sm" href={`/company/${companyId}/plan/new?fix=${i}`}>
                          Fix in Plan
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Other tabs show placeholder */}
            {!['executive', 'gaps'].includes(resultsTab) && (
              <Card>
                <div className="p-12 text-center text-gray-500">
                  <FiActivity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{resultsTabs.find(t => t.key === resultsTab)?.label} analysis coming soon</p>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
