'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FiBuilding, FiUsers, FiDatabase, FiCheck } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Input, Select } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 1: Company Onboarding - Create context once
type OnboardingStep = 'profile' | 'stakeholders' | 'data_sources' | 'complete';

const steps: { key: OnboardingStep; label: string; icon: React.ReactNode }[] = [
  { key: 'profile', label: 'Company Profile', icon: <FiBuilding /> },
  { key: 'stakeholders', label: 'Stakeholders', icon: <FiUsers /> },
  { key: 'data_sources', label: 'Data Sources', icon: <FiDatabase /> },
  { key: 'complete', label: 'Complete', icon: <FiCheck /> },
];

export default function OnboardingPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('profile');

  return (
    <PageLayout title="Company Onboarding">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'company', id: companyId, label: 'Company', href: `/company/${companyId}/settings` },
          ]}
        />

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === step.key
                    ? 'bg-primary text-white'
                    : steps.findIndex(s => s.key === currentStep) > index
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.icon}
              </div>
              <span className="ml-2 text-sm font-medium hidden md:block">{step.label}</span>
              {index < steps.length - 1 && (
                <div className="w-12 md:w-24 h-0.5 bg-gray-200 mx-2" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 'profile' && (
          <Card>
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Company Profile</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Legal name" placeholder="Acme AB" />
                <Input label="Org number" placeholder="556xxx-xxxx" />
                <Input label="Sector" placeholder="Technology" />
                <Input label="Headcount now" type="number" placeholder="50" />
                <Input label="12 month target" type="number" placeholder="75" />
                <Select
                  label="Union status"
                  options={[
                    { value: 'no_agreement', label: 'No agreement' },
                    { value: 'agreement', label: 'Agreement' },
                    { value: 'agreement_like', label: 'Agreement-like' },
                  ]}
                />
                <Select
                  label="Payroll system"
                  options={[
                    { value: 'visma', label: 'Visma' },
                    { value: 'fortnox', label: 'Fortnox' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep('stakeholders')}>
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 'stakeholders' && (
          <Card>
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Stakeholders</h2>
              <p className="text-gray-600">Invite key stakeholders to collaborate on benefits design.</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input label="CFO Email" placeholder="cfo@company.com" className="flex-1" />
                  <Button variant="outline">Invite CFO</Button>
                </div>
                <div className="flex items-center gap-4">
                  <Input label="HR Email" placeholder="hr@company.com" className="flex-1" />
                  <Button variant="outline">Invite HR</Button>
                </div>
                <div className="flex items-center gap-4">
                  <Input label="CEO Email" placeholder="ceo@company.com" className="flex-1" />
                  <Button variant="outline">Invite CEO</Button>
                </div>
              </div>
              <div className="pt-4 border-t">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-600">Add optional board observer role</span>
                </label>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('profile')}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep('data_sources')}>
                  Continue
                </Button>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 'data_sources' && (
          <Card>
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Data Sources</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Upload Employee Data</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a CSV with employee salary, age band, and role information.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button variant="outline">Download CSV Template</Button>
                    <Button>Upload CSV</Button>
                  </div>
                </div>
                <div className="p-4 border rounded-lg opacity-50">
                  <h3 className="font-medium mb-2">Connect Payroll</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Automatically sync employee data from your payroll system.
                  </p>
                  <Button variant="outline" disabled>Coming Soon</Button>
                </div>
                <div className="p-4 border rounded-lg opacity-50">
                  <h3 className="font-medium mb-2">Connect Pension Provider</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Import current pension details automatically.
                  </p>
                  <Button variant="outline" disabled>Coming Soon</Button>
                </div>
              </div>
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep('stakeholders')}>
                  Back
                </Button>
                <Button onClick={() => setCurrentStep('complete')}>
                  Complete Setup
                </Button>
              </div>
            </div>
          </Card>
        )}

        {currentStep === 'complete' && (
          <Card>
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <FiCheck className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold">Onboarding Complete</h2>
              <p className="text-gray-600">
                Your company is set up. Start your audit to analyze your current benefits.
              </p>
              <Button href={`/company/${companyId}/audit/new`}>
                Start Audit
              </Button>
            </div>
          </Card>
        )}

        {/* Links */}
        <div className="flex gap-4 text-sm">
          <a href="#" className="text-primary hover:underline">Download CSV template</a>
          <a href="#" className="text-primary hover:underline">View data requirements</a>
        </div>
      </div>
    </PageLayout>
  );
}
