'use client';

import { useApp } from '@/contexts/AppContext';
import { PageLayout } from '@/components/layout';
import { Card, CardHeader, CardBody, Badge, EmptyState } from '@/components/ui';
import {
  FiPhone,
  FiShield,
  FiAlertTriangle,
  FiDroplet,
  FiZap,
  FiWind,
  FiInfo,
  FiMapPin,
} from 'react-icons/fi';

export default function SafetyPage() {
  const { state, getHouseById } = useApp();

  const selectedHouse = state.selectedHouseId
    ? getHouseById(state.selectedHouseId)
    : null;

  const safetyInfo = selectedHouse?.safetyInfo;

  if (!selectedHouse) {
    return (
      <PageLayout>
        <EmptyState
          icon={<FiShield className="w-8 h-8" />}
          title="No property selected"
          description="Select a property to view safety information."
        />
      </PageLayout>
    );
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return <FiAlertTriangle className="w-5 h-5 text-rose-500" />;
      case 'owner':
        return <FiShield className="w-5 h-5 text-primary-500" />;
      default:
        return <FiPhone className="w-5 h-5 text-slate-400" />;
    }
  };

  const getContactBadge = (type: string) => {
    switch (type) {
      case 'emergency':
        return <Badge variant="danger" size="sm">Emergency</Badge>;
      case 'owner':
        return <Badge variant="info" size="sm">Owner</Badge>;
      case 'neighbor':
        return <Badge variant="neutral" size="sm">Neighbor</Badge>;
      case 'maintenance':
        return <Badge variant="warning" size="sm">Maintenance</Badge>;
      default:
        return <Badge variant="neutral" size="sm">Other</Badge>;
    }
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center">
              <FiShield className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Safety Information</h1>
              <p className="text-slate-500 text-sm">{selectedHouse.name}</p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <FiAlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-rose-800">In case of emergency</h3>
              <p className="text-sm text-rose-700 mt-1">
                Call 911 for immediate emergencies. This page is available offline.
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiPhone className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-slate-800">Emergency Contacts</h2>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            {!safetyInfo?.emergencyContacts || safetyInfo.emergencyContacts.length === 0 ? (
              <div className="p-6 text-center">
                <FiPhone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No emergency contacts configured</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {safetyInfo.emergencyContacts.map((contact) => (
                  <li key={contact.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getContactIcon(contact.type)}
                        <div>
                          <p className="font-medium text-slate-800">{contact.name}</p>
                          <a
                            href={`tel:${contact.phone}`}
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                          >
                            {contact.phone}
                          </a>
                        </div>
                      </div>
                      {getContactBadge(contact.type)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        {/* Safety Equipment Locations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FiMapPin className="w-5 h-5 text-slate-600" />
              <h2 className="font-semibold text-slate-800">Safety Equipment & Shutoffs</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {/* Fire Extinguisher */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Fire Extinguisher</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  {safetyInfo?.fireExtinguisherLocation || 'Location not specified'}
                </p>
              </div>
            </div>

            {/* Water Shutoff */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiDroplet className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Water Shutoff</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  {safetyInfo?.waterShutoff || 'Location not specified'}
                </p>
              </div>
            </div>

            {/* Electric Main Switch */}
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiZap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800">Electric Main Switch</h3>
                <p className="text-sm text-slate-600 mt-0.5">
                  {safetyInfo?.electricMainSwitch || 'Location not specified'}
                </p>
              </div>
            </div>

            {/* Gas Shutoff */}
            {safetyInfo?.gasShutoff && (
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiWind className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">Gas Shutoff</h3>
                  <p className="text-sm text-slate-600 mt-0.5">{safetyInfo.gasShutoff}</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Additional Information */}
        {safetyInfo?.additionalInfo && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FiInfo className="w-5 h-5 text-slate-600" />
                <h2 className="font-semibold text-slate-800">Additional Safety Information</h2>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-slate-600 whitespace-pre-line">{safetyInfo.additionalInfo}</p>
            </CardBody>
          </Card>
        )}

        {/* Property Address */}
        {selectedHouse.address && (
          <Card>
            <CardBody className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMapPin className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">Property Address</h3>
                  <p className="text-sm text-slate-600 mt-0.5">{selectedHouse.address}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
