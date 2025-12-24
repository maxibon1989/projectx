'use client';

import { useParams } from 'next/navigation';
import { FiDollarSign, FiShield, FiHelpCircle, FiAward, FiTrendingUp, FiInfo, FiHeart, FiBriefcase, FiHome } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 7: My Security - Trust through clarity
export default function MySecurityPage() {
  const params = useParams();
  const employeeId = params.employeeId as string;

  const data = {
    pensionBalance: 125000,
    contributionsLastMonth: 2475,
    insurances: [
      { name: 'Life Insurance', coverage: '3x annual salary', active: true },
      { name: 'Disability', coverage: '80% of salary', active: true },
      { name: 'Occupational Injury', coverage: 'Full protection', active: true },
    ],
    scenarios: [
      {
        title: 'Sick leave',
        icon: <FiHeart className="w-5 h-5" />,
        whatYouGet: '80% of salary for first 14 days, then 10% top-up for 90 days',
        source: 'Employer + Social Insurance',
      },
      {
        title: 'Work injury',
        icon: <FiBriefcase className="w-5 h-5" />,
        whatYouGet: 'Full salary continuation + medical costs covered',
        source: 'Employer insurance (Euro Accident)',
      },
      {
        title: 'Parental leave',
        icon: <FiHome className="w-5 h-5" />,
        whatYouGet: '5,000 SEK/month top-up for 6 months',
        source: 'Employer policy',
      },
    ],
    retirementProjection: {
      current: 12500,
      withUnbound: 14800,
      feeSavings: 2300,
    },
  };

  return (
    <PageLayout title="My Security" variant="employee">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'enrollment', id: 'en1', label: 'My Enrollment', href: '#' },
            { type: 'policy_document', id: 'd1', label: 'Policy Docs', href: '/docs/d1' },
            { type: 'certificate_version', id: 'c1', label: 'Certificate', href: '#' },
          ]}
        />

        {/* Today */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-500">Pension Balance</h3>
                  <FiDollarSign className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-bold">{data.pensionBalance.toLocaleString()} SEK</p>
                <p className="text-sm text-green-600 mt-1">
                  +{data.contributionsLastMonth.toLocaleString()} SEK last month
                </p>
              </div>
            </Card>

            <Card className="md:col-span-2">
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-500">Active Insurance</h3>
                  <FiShield className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-2">
                  {data.insurances.map((ins) => (
                    <div key={ins.name} className="flex items-center justify-between">
                      <span>{ins.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{ins.coverage}</span>
                        <Badge variant="green" size="sm">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* If Something Happens */}
        <div>
          <h2 className="text-lg font-semibold mb-4">If something happens</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.scenarios.map((scenario) => (
              <Card key={scenario.title}>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      {scenario.icon}
                    </div>
                    <h3 className="font-medium">{scenario.title}</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">What you get</p>
                      <p className="text-sm font-medium">{scenario.whatYouGet}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Where it comes from</p>
                      <p className="text-sm">{scenario.source}</p>
                    </div>
                  </div>
                  <a href="#" className="text-primary text-sm hover:underline mt-4 block">
                    View policy details
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Projection */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5" />
              Retirement Projection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">With traditional provider</p>
                    <p className="text-xl font-medium">{data.retirementProjection.current.toLocaleString()} SEK/month</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-500 mb-1">With Unbound</p>
                    <p className="text-xl font-bold text-green-700">{data.retirementProjection.withUnbound.toLocaleString()} SEK/month</p>
                    <p className="text-sm text-green-600 mt-1">
                      +{data.retirementProjection.feeSavings.toLocaleString()} SEK/month from lower fees
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-3">Adjust extra contribution</p>
                <input type="range" className="w-full" min="0" max="5000" defaultValue="0" />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>+0 SEK</span>
                  <span>+5,000 SEK/month</span>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Extra contributions are tax-efficient through salary exchange.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Proof */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Your plan is certified</h3>
                  <p className="text-sm text-gray-500">
                    This plan meets or exceeds all legal and CBA requirements.
                  </p>
                </div>
              </div>
              <a href="#" className="text-primary text-sm hover:underline">
                View certificate
              </a>
            </div>
          </div>
        </Card>

        {/* Ask a Question */}
        <div className="text-center py-4">
          <Button variant="outline" href="/support/tickets/new">
            <FiHelpCircle className="w-4 h-4 mr-2" />
            Ask a question
          </Button>
          <p className="text-xs text-gray-400 mt-2">
            You can leave Unbound at any time. Your pension stays yours.
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
