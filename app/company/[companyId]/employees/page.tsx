'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FiPlus, FiUser, FiMail, FiFilter, FiSearch } from 'react-icons/fi';
import { PageLayout } from '@/components/layout';
import { Card, Button, Badge, Input } from '@/components/ui';

// Page 6: Employee Directory
export default function EmployeesPage() {
  const params = useParams();
  const companyId = params.companyId as string;

  const [filter, setFilter] = useState<'all' | 'activated' | 'needs_action' | 'opted_out'>('all');
  const [search, setSearch] = useState('');

  const employees = [
    { id: 'e1', name: 'Anna Svensson', email: 'anna@company.com', roleGroup: 'Engineering', status: 'enrolled' },
    { id: 'e2', name: 'Erik Lindgren', email: 'erik@company.com', roleGroup: 'Sales', status: 'activated' },
    { id: 'e3', name: 'Maria Johansson', email: 'maria@company.com', roleGroup: 'Operations', status: 'invited' },
    { id: 'e4', name: 'Johan Berg', email: 'johan@company.com', roleGroup: 'Engineering', status: 'enrolled' },
    { id: 'e5', name: 'Lisa Karlsson', email: 'lisa@company.com', roleGroup: 'HR', status: 'opted_out' },
  ];

  const filteredEmployees = employees.filter((emp) => {
    if (filter === 'activated' && emp.status !== 'activated' && emp.status !== 'enrolled') return false;
    if (filter === 'needs_action' && emp.status !== 'invited') return false;
    if (filter === 'opted_out' && emp.status !== 'opted_out') return false;
    if (search && !emp.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const statusColors = {
    invited: 'amber',
    activated: 'blue',
    enrolled: 'green',
    opted_out: 'gray',
  };

  return (
    <PageLayout title="Employees">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-gray-600">
            Manage employee enrollment and track adoption.
          </p>
          <Button>
            <FiPlus className="w-4 h-4 mr-2" />
            Invite Employees
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'activated', label: 'Activated' },
              { key: 'needs_action', label: 'Needs Action' },
              { key: 'opted_out', label: 'Opted Out' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as typeof filter)}
                className={`px-4 py-2 rounded-lg text-sm ${
                  filter === f.key
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold">{employees.length}</p>
              <p className="text-sm text-gray-500">Total</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {employees.filter((e) => e.status === 'enrolled').length}
              </p>
              <p className="text-sm text-gray-500">Enrolled</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">
                {employees.filter((e) => e.status === 'invited').length}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </Card>
          <Card>
            <div className="p-4 text-center">
              <p className="text-2xl font-bold text-gray-400">
                {employees.filter((e) => e.status === 'opted_out').length}
              </p>
              <p className="text-sm text-gray-500">Opted Out</p>
            </div>
          </Card>
        </div>

        {/* Employee List */}
        <Card>
          <div className="divide-y">
            {filteredEmployees.map((employee) => (
              <Link
                key={employee.id}
                href={`/company/${companyId}/employees/${employee.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-gray-500">{employee.roleGroup}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{employee.email}</span>
                  <Badge variant={statusColors[employee.status as keyof typeof statusColors] as 'amber' | 'blue' | 'green' | 'gray'}>
                    {employee.status.replace('_', ' ')}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
