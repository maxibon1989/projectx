'use client';

import { useParams } from 'next/navigation';
import { FiCreditCard, FiFileText, FiUsers, FiArrowUp, FiCheck } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 14: Billing - Make it feel real
export default function BillingPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const billing = {
    plan: 'professional',
    pricePerEmployee: 49,
    seatCount: 52,
    monthlyTotal: 2548,
    addOns: [
      { name: 'Audit', enabled: true, price: 500 },
      { name: 'Certificate', enabled: true, price: 200 },
      { name: 'Monitoring', enabled: true, price: 100 },
      { name: 'Benefits Wallet', enabled: false, price: 300 },
    ],
    invoices: [
      { id: 'inv1', date: '2024-02-01', amount: 2848, status: 'paid' },
      { id: 'inv2', date: '2024-01-01', amount: 2848, status: 'paid' },
      { id: 'inv3', date: '2023-12-01', amount: 2548, status: 'paid' },
    ],
  };

  const plans = [
    {
      name: 'Starter',
      price: 29,
      features: ['Up to 25 employees', 'Basic audit', 'Email support'],
      current: false,
    },
    {
      name: 'Professional',
      price: 49,
      features: ['Up to 100 employees', 'Full audit', 'Certificate', 'Priority support'],
      current: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      features: ['Unlimited employees', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
      current: false,
    },
  ];

  return (
    <PageLayout title="Billing">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'company', id: companyId, label: 'Acme AB', href: `/company/${companyId}/settings` },
          ]}
        />

        {/* Current Plan */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <Badge variant="primary" size="lg" className="mb-2">Professional Plan</Badge>
                <p className="text-gray-600">
                  {billing.pricePerEmployee} SEK per employee per month
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">{billing.monthlyTotal.toLocaleString()} SEK</p>
                <p className="text-sm text-gray-500">/ month</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Seat count</p>
                  <p className="font-semibold">{billing.seatCount} employees</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Next billing</p>
                  <p className="font-semibold">March 1, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Add-ons */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4">Add-ons</h3>
            <div className="space-y-3">
              {billing.addOns.map((addOn) => (
                <div key={addOn.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      addOn.enabled ? 'bg-green-100' : 'bg-gray-200'
                    }`}>
                      {addOn.enabled && <FiCheck className="w-4 h-4 text-green-600" />}
                    </div>
                    <span className="font-medium">{addOn.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{addOn.price} SEK/month</span>
                    <Button variant={addOn.enabled ? 'outline' : 'primary'} size="sm">
                      {addOn.enabled ? 'Remove' : 'Add'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Plans Comparison */}
        <div>
          <h3 className="font-semibold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.current ? 'ring-2 ring-primary' : ''}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold">{plan.name}</h4>
                    {plan.current && <Badge variant="primary">Current</Badge>}
                  </div>
                  <div className="mb-4">
                    {typeof plan.price === 'number' ? (
                      <>
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-gray-500"> SEK/employee</span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">{plan.price}</span>
                    )}
                  </div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <FiCheck className="w-4 h-4 text-green-600" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.current ? 'outline' : 'primary'}
                    className="w-full"
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                    {!plan.current && <FiArrowUp className="w-4 h-4 ml-2" />}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Invoice History */}
        <Card>
          <div className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FiFileText className="w-5 h-5" />
              Invoice History
            </h3>
            <div className="space-y-2">
              {billing.invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-gray-500">Invoice #{invoice.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{invoice.amount.toLocaleString()} SEK</span>
                    <Badge variant="green">{invoice.status}</Badge>
                    <Button variant="ghost" size="sm">Download</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
