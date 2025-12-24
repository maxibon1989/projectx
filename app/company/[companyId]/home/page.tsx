'use client';

import { useParams } from 'next/navigation';
import { FiPlay, FiTrendingUp, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, StatCard, Badge, Button } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 0: Home - One click to value
export default function HomePage() {
  const params = useParams();
  const companyId = params.companyId as string;

  // Mock data - would come from context/API
  const companyState = 'plan_drafted'; // baseline_only | plan_drafted | certificate_issued | live_pilot
  const nextAction = 'Issue certificate';
  const nextActionHref = `/company/${companyId}/certificate/new`;

  const stateLabels = {
    baseline_only: 'Baseline only',
    plan_drafted: 'Plan drafted',
    certificate_issued: 'Certificate issued',
    live_pilot: 'Live pilot',
  };

  const stateColors = {
    baseline_only: 'gray',
    plan_drafted: 'amber',
    certificate_issued: 'blue',
    live_pilot: 'green',
  };

  return (
    <PageLayout title="Home">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'audit_report', id: 'a1', label: 'Audit v1', href: `/company/${companyId}/audit/a1` },
            { type: 'plan_version', id: 'p1', label: 'Plan v2', href: `/company/${companyId}/plan/p1` },
          ]}
        />

        {/* Status at a glance */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Status at a glance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={stateColors[companyState as keyof typeof stateColors] as 'gray' | 'amber' | 'blue' | 'green'}>
                  {stateLabels[companyState as keyof typeof stateLabels]}
                </Badge>
              </div>
              <Button href={nextActionHref}>
                <FiPlay className="w-4 h-4 mr-2" />
                {nextAction}
              </Button>
            </div>
          </div>
        </Card>

        {/* Savings and risk */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Savings and risk</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Estimated annual savings"
              value="120K - 180K SEK"
              icon={<FiTrendingUp className="w-5 h-5" />}
              trend={{ value: 15, isPositive: true }}
            />
            <StatCard
              title="Risk hotspots"
              value="3"
              icon={<FiAlertCircle className="w-5 h-5" />}
              description="Compliance gaps found"
            />
            <StatCard
              title="Employee upside score"
              value="72"
              icon={<FiCheckCircle className="w-5 h-5" />}
              description="Out of 100"
            />
          </div>
        </div>

        {/* Open loops */}
        <Card>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Open loops</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Missing data items</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Tasks due this week</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Open tickets</span>
                <span className="font-medium">1</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
