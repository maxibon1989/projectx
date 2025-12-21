'use client';

import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Badge,
  Avatar,
} from '@/components/ui';
import { getRoleDisplayName, generateInviteCode } from '@/lib/utils';
import {
  FiSettings,
  FiUsers,
  FiHome,
  FiCopy,
  FiRefreshCw,
  FiTrash2,
} from 'react-icons/fi';

export default function SettingsPage() {
  const { state, dispatch } = useApp();
  const [inviteCode, setInviteCode] = useState(
    state.familyGroup?.inviteCode || generateInviteCode()
  );
  const [copied, setCopied] = useState(false);

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateCode = () => {
    const newCode = generateInviteCode();
    setInviteCode(newCode);
    if (state.familyGroup) {
      dispatch({
        type: 'SET_FAMILY_GROUP',
        payload: { ...state.familyGroup, inviteCode: newCode },
      });
    }
  };

  const handleClearData = () => {
    if (
      confirm(
        'This will clear all local data and reset the app to its initial state. Are you sure?'
      )
    ) {
      dispatch({ type: 'CLEAR_DATA' });
      window.location.reload();
    }
  };

  const isAdmin = state.currentUser?.role === 'admin';

  return (
    <PageLayout title="Settings">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-slate-800">Your Profile</h3>
          </CardHeader>
          <CardBody>
            {state.currentUser && (
              <div className="flex items-center gap-4">
                <Avatar name={state.currentUser.name} size="lg" />
                <div>
                  <h4 className="text-lg font-medium text-slate-800">
                    {state.currentUser.name}
                  </h4>
                  <p className="text-sm text-slate-500">{state.currentUser.email}</p>
                  <Badge variant="info" size="sm" className="mt-1">
                    {getRoleDisplayName(state.currentUser.role)}
                  </Badge>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Family Group Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiUsers className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-slate-800">Family Group</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-slate-500 mb-1">Group Name</p>
              <p className="font-medium text-slate-800">
                {state.familyGroup?.name || 'No group'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500 mb-2">Members</p>
              <div className="space-y-2">
                {state.familyGroup?.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={member.name} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {member.name}
                          {member.id === state.currentUser?.id && (
                            <span className="text-slate-400 ml-1">(you)</span>
                          )}
                        </p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant={member.role === 'admin' ? 'info' : 'neutral'}
                      size="sm"
                    >
                      {getRoleDisplayName(member.role)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {isAdmin && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-700 mb-2">
                  Invite Code
                </p>
                <p className="text-xs text-slate-500 mb-2">
                  Share this code with family members to let them join the group.
                </p>
                <div className="flex items-center gap-2">
                  <Input value={inviteCode} readOnly className="font-mono" />
                  <Button variant="outline" onClick={copyInviteCode}>
                    <FiCopy className="w-4 h-4" />
                    {copied ? 'Copied!' : ''}
                  </Button>
                  <Button variant="ghost" onClick={regenerateCode}>
                    <FiRefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Houses Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiHome className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-slate-800">Houses</h3>
            </div>
          </CardHeader>
          <CardBody>
            {state.houses.length === 0 ? (
              <p className="text-sm text-slate-500">No houses added yet.</p>
            ) : (
              <div className="space-y-2">
                {state.houses.map((house) => (
                  <div
                    key={house.id}
                    className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-700">{house.name}</p>
                      <p className="text-xs text-slate-500">
                        {house.rooms.length} rooms · {house.rules.length} rules
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiSettings className="w-5 h-5 text-slate-400" />
              <h3 className="font-semibold text-slate-800">Data Management</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-slate-700 mb-1">Local Storage</p>
              <p className="text-xs text-slate-500 mb-3">
                All data is stored locally in your browser. This is a demo app without a backend.
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <Button
                variant="danger"
                onClick={handleClearData}
                className="flex items-center gap-2"
              >
                <FiTrash2 className="w-4 h-4" />
                Clear All Data
              </Button>
              <p className="text-xs text-slate-500 mt-2">
                This will reset the app to its initial demo state.
              </p>
            </div>
          </CardBody>
        </Card>

        {/* About */}
        <Card>
          <CardBody>
            <div className="text-center text-sm text-slate-500">
              <p className="font-medium text-slate-700 mb-1">
                Family Home Planner
              </p>
              <p>
                A coordination system for families sharing one or multiple homes.
              </p>
              <p className="mt-2 text-xs">
                Demo version · Data stored locally
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </PageLayout>
  );
}
