'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { FiDollarSign, FiShield, FiHeart, FiCreditCard, FiCheckSquare, FiTrendingUp, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge, StatCard } from '@/components/ui';
import { RelatedChips } from '@/components/layout/RelatedChips';

// Page 4: Plan Builder
type PlanModule = 'pension' | 'insurance' | 'topups' | 'wallet' | 'compliance';

export default function PlanBuilderPage() {
  const params = useParams();
  const companyId = params.companyId as string;
  const planId = params.planId as string;

  const [activeModule, setActiveModule] = useState<PlanModule>('pension');

  const modules = [
    { key: 'pension', label: 'Pension', icon: <FiDollarSign /> },
    { key: 'insurance', label: 'Insurance', icon: <FiShield /> },
    { key: 'topups', label: 'Top-ups', icon: <FiHeart /> },
    { key: 'wallet', label: 'Benefits Wallet', icon: <FiCreditCard /> },
    { key: 'compliance', label: 'Compliance', icon: <FiCheckSquare /> },
  ];

  return (
    <PageLayout title={planId === 'new' ? 'New Plan' : 'Plan Builder'}>
      <div className="space-y-6">
        {/* Related objects */}
        <RelatedChips
          links={[
            { type: 'audit_report', id: 'a1', label: 'Audit v1', href: `/company/${companyId}/audit/a1` },
            { type: 'certificate_version', id: 'c1', label: 'Certificate v1', href: `/company/${companyId}/certificate/c1` },
            { type: 'task', id: 't1', label: 'Provider Quote', href: '/ops/tasks/t1' },
          ]}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Module List */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-3">Modules</h3>
                <div className="space-y-2">
                  {modules.map((module) => (
                    <button
                      key={module.key}
                      onClick={() => setActiveModule(module.key as PlanModule)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg text-left ${
                        activeModule === module.key
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      {module.icon}
                      <span>{module.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Preview Panel */}
            <Card>
              <div className="p-4">
                <h3 className="font-semibold mb-3">Plan Preview</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Current cost</span>
                      <span>850K SEK</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Plan cost</span>
                      <span className="text-green-600">780K SEK</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium pt-2 border-t">
                      <span>Savings</span>
                      <span className="text-green-600">70K SEK/year</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Equivalence</span>
                      <Badge variant="green">
                        <FiCheck className="w-3 h-3 mr-1" />
                        Green
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Employee upside</span>
                      <span className="text-sm font-medium text-green-600">+12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right: Module Configuration */}
          <div className="lg:col-span-2">
            <Card>
              <div className="p-6">
                {activeModule === 'pension' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">Pension Configuration</h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Base contribution percent</label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="4"
                            max="10"
                            defaultValue="5.5"
                            className="flex-1"
                          />
                          <span className="font-medium w-16">5.5%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">Salary exchange</h4>
                          <p className="text-sm text-gray-500">Allow employees to exchange salary for pension</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Fund selection mode</label>
                        <div className="space-y-2">
                          {[
                            { value: 'default', label: 'Default portfolio (recommended)' },
                            { value: 'list', label: 'Choose from curated list' },
                            { value: 'employee', label: 'Employee picks (advanced)' },
                          ].map((option) => (
                            <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <input type="radio" name="fundMode" value={option.value} defaultChecked={option.value === 'default'} />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 text-green-700">
                          <FiTrendingUp className="w-5 h-5" />
                          <span className="font-medium">Fee model: 45 SEK/month</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Compared to avg. 180 SEK/month with traditional providers
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'insurance' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">Insurance Configuration</h2>

                    {[
                      { title: 'Life Insurance', description: 'Death benefit for dependents' },
                      { title: 'Disability Insurance', description: 'Income protection for illness' },
                      { title: 'Occupational Injury', description: 'Work-related accident coverage' },
                    ].map((insurance) => (
                      <div key={insurance.title} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{insurance.title}</h4>
                            <p className="text-sm text-gray-500">{insurance.description}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600">Coverage level</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option>Standard (CBA equivalent)</option>
                              <option>Enhanced</option>
                              <option>Premium</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Provider</label>
                            <select className="w-full mt-1 p-2 border rounded">
                              <option>TBD - Request quotes</option>
                              <option>Euro Accident</option>
                              <option>Bliwa</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeModule === 'topups' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">Top-ups Configuration</h2>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Parental top-up</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Amount (SEK/month)</label>
                          <input type="number" className="w-full mt-1 p-2 border rounded" placeholder="5000" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Duration (months)</label>
                          <input type="number" className="w-full mt-1 p-2 border rounded" placeholder="6" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Sickness top-up</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-gray-600">Percent of salary</label>
                          <input type="number" className="w-full mt-1 p-2 border rounded" placeholder="10" />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600">Duration (days)</label>
                          <input type="number" className="w-full mt-1 p-2 border rounded" placeholder="90" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Notice & Severance</h4>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked />
                          <span>Standard notice period</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" />
                          <span>Enable severance (months per year of service)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'wallet' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">Benefits Wallet</h2>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Enable Benefits Wallet</h4>
                        <p className="text-sm text-gray-500">Give employees budget to allocate</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Annual budget per employee (SEK)</label>
                      <input type="number" className="w-full p-2 border rounded" defaultValue="5000" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Categories</label>
                      <div className="space-y-2">
                        {[
                          { name: 'Wellness', taxable: false },
                          { name: 'Training', taxable: false },
                          { name: 'Equipment', taxable: true },
                          { name: 'Extra pension', taxable: false },
                        ].map((cat) => (
                          <div key={cat.name} className="flex items-center justify-between p-3 border rounded-lg">
                            <label className="flex items-center gap-3">
                              <input type="checkbox" defaultChecked />
                              <span>{cat.name}</span>
                            </label>
                            <Badge variant={cat.taxable ? 'amber' : 'green'}>
                              {cat.taxable ? 'Taxable' : 'Tax-free'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeModule === 'compliance' && (
                  <div className="space-y-6">
                    <h2 className="text-lg font-semibold">Compliance Layer</h2>

                    <div>
                      <label className="block text-sm font-medium mb-2">LAS handling stance</label>
                      <div className="space-y-2">
                        {[
                          { value: 'standard', label: 'Standard - Follow legal minimums' },
                          { value: 'enhanced', label: 'Enhanced - Exceed requirements' },
                          { value: 'custom', label: 'Custom - Define specific rules' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                            <input type="radio" name="las" value={option.value} defaultChecked={option.value === 'standard'} />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Documentation pack</h4>
                        <p className="text-sm text-gray-500">Auto-generate compliance documents</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Monitoring frequency</label>
                      <select className="w-full p-2 border rounded">
                        <option value="monthly">Monthly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="annually">Annually</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4 mt-6">
              <Button href={`/company/${companyId}/certificate/new?planId=${planId}`}>
                Generate Certificate
              </Button>
              <Button variant="outline">
                Request Provider Quote
              </Button>
              <Button variant="outline" href="/docs">
                Generate Employee Pack
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
