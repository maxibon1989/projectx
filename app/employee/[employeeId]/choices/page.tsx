'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FiDollarSign, FiCreditCard, FiPieChart, FiDownload, FiPlus, FiArrowRight } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 8: My Choices - Let employees feel upside
export default function MyChoicesPage() {
  const params = useParams();
  const employeeId = params.employeeId as string;

  const [salaryExchange, setSalaryExchange] = useState(true);
  const [exchangeAmount, setExchangeAmount] = useState(1500);

  const walletBudget = 5000;
  const allocations = [
    { category: 'Wellness', amount: 2000, color: 'bg-green-500' },
    { category: 'Training', amount: 1500, color: 'bg-blue-500' },
    { category: 'Equipment', amount: 1000, color: 'bg-purple-500' },
    { category: 'Extra Pension', amount: 500, color: 'bg-amber-500' },
  ];

  const fundOptions = [
    { id: 'f1', name: 'Balanced Portfolio', risk: 'Medium', selected: true },
    { id: 'f2', name: 'Growth Portfolio', risk: 'High', selected: false },
    { id: 'f3', name: 'Stable Portfolio', risk: 'Low', selected: false },
  ];

  return (
    <PageLayout title="My Choices" variant="employee">
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'plan_version', id: 'p1', label: 'Plan Rules', href: '#' },
            { type: 'task', id: 't1', label: 'Vendor Request', href: '/ops/tasks/t1' },
          ]}
        />

        {/* Salary Exchange */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Salary Exchange</h2>
                  <p className="text-sm text-gray-500">Exchange salary for tax-efficient pension</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={salaryExchange}
                  onChange={(e) => setSalaryExchange(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>

            {salaryExchange && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600">Monthly amount (SEK)</label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={exchangeAmount}
                    onChange={(e) => setExchangeAmount(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>500 SEK</span>
                    <span className="font-medium text-primary">{exchangeAmount.toLocaleString()} SEK</span>
                    <span>5,000 SEK</span>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Impact Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Gross salary reduction</p>
                      <p className="font-medium">-{exchangeAmount.toLocaleString()} SEK</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Net salary reduction</p>
                      <p className="font-medium">-{Math.round(exchangeAmount * 0.65).toLocaleString()} SEK</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Pension contribution</p>
                      <p className="font-medium text-green-600">+{exchangeAmount.toLocaleString()} SEK</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Your tax savings</p>
                      <p className="font-medium text-green-600">+{Math.round(exchangeAmount * 0.35).toLocaleString()} SEK</p>
                    </div>
                  </div>
                </div>

                <a href={`/employee/${employeeId}/security#projection`} className="text-primary text-sm hover:underline inline-flex items-center gap-1">
                  Compare outcomes <FiArrowRight className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </Card>

        {/* Benefits Wallet */}
        <Card>
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold">Benefits Wallet</h2>
                  <p className="text-sm text-gray-500">
                    {walletBudget.toLocaleString()} SEK annual budget
                  </p>
                </div>
              </div>
              <Badge variant="green">{allocations.reduce((sum, a) => sum + a.amount, 0).toLocaleString()} SEK allocated</Badge>
            </div>

            {/* Allocation Bar */}
            <div className="mb-6">
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                {allocations.map((alloc) => (
                  <div
                    key={alloc.category}
                    className={`${alloc.color}`}
                    style={{ width: `${(alloc.amount / walletBudget) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="space-y-3">
              {allocations.map((alloc) => (
                <div key={alloc.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${alloc.color}`} />
                    <span>{alloc.category}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <input
                      type="number"
                      value={alloc.amount}
                      className="w-24 p-2 border rounded text-right"
                      readOnly
                    />
                    <span className="text-sm text-gray-500">SEK</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              Drag budget across categories or enter amounts directly. Changes take effect next month.
            </p>
          </div>
        </Card>

        {/* Fund Choice */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FiPieChart className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold">Fund Choice</h2>
                <p className="text-sm text-gray-500">Choose your pension investment strategy</p>
              </div>
            </div>

            <div className="space-y-3">
              {fundOptions.map((fund) => (
                <label
                  key={fund.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer ${
                    fund.selected ? 'border-primary bg-primary/5' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="fund"
                      checked={fund.selected}
                      readOnly
                      className="text-primary"
                    />
                    <div>
                      <p className="font-medium">{fund.name}</p>
                      <p className="text-sm text-gray-500">Risk level: {fund.risk}</p>
                    </div>
                  </div>
                  {fund.selected && <Badge variant="primary">Selected</Badge>}
                </label>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-4">
              All options have low fees. Risk refers to short-term volatility, not long-term outcomes.
            </p>
          </div>
        </Card>

        {/* Documents */}
        <Card>
          <div className="p-6">
            <h2 className="font-semibold mb-4">Download My Documents</h2>
            <div className="space-y-2">
              {[
                'My Policy Pack',
                'Pension Statement',
                'Insurance Certificate',
              ].map((doc) => (
                <button
                  key={doc}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <span>{doc}</span>
                  <FiDownload className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Nominate Vendor */}
        <Card>
          <div className="p-6">
            <h2 className="font-semibold mb-2">Nominate Benefit Vendors</h2>
            <p className="text-sm text-gray-500 mb-4">
              Suggest a vendor you'd like to use for wellness, training, or equipment.
            </p>
            <Button variant="outline">
              <FiPlus className="w-4 h-4 mr-2" />
              Nominate Vendor
            </Button>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
