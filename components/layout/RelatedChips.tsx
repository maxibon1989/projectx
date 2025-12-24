'use client';

import Link from 'next/link';
import { FiFileText, FiClipboard, FiLayers, FiAward, FiUser, FiCheckCircle, FiMessageCircle, FiLink, FiFile, FiBriefcase } from 'react-icons/fi';
import { GlobalObjectType, OBJECT_TYPE_LABELS } from '@/types';

interface RelatedChip {
  type: GlobalObjectType;
  id: string;
  label: string;
  href: string;
  version?: number;
}

interface RelatedChipsProps {
  links: RelatedChip[];
}

const objectIcons: Record<GlobalObjectType, React.ReactNode> = {
  company: <FiBriefcase className="w-3 h-3" />,
  audit_report: <FiClipboard className="w-3 h-3" />,
  plan_version: <FiLayers className="w-3 h-3" />,
  certificate_version: <FiAward className="w-3 h-3" />,
  policy_document: <FiFile className="w-3 h-3" />,
  provider_policy: <FiFileText className="w-3 h-3" />,
  employee: <FiUser className="w-3 h-3" />,
  enrollment: <FiCheckCircle className="w-3 h-3" />,
  task: <FiLink className="w-3 h-3" />,
  ticket: <FiMessageCircle className="w-3 h-3" />,
};

const objectColors: Record<GlobalObjectType, string> = {
  company: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  audit_report: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
  plan_version: 'bg-blue-50 text-blue-700 hover:bg-blue-100',
  certificate_version: 'bg-green-50 text-green-700 hover:bg-green-100',
  policy_document: 'bg-purple-50 text-purple-700 hover:bg-purple-100',
  provider_policy: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
  employee: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100',
  enrollment: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
  task: 'bg-orange-50 text-orange-700 hover:bg-orange-100',
  ticket: 'bg-pink-50 text-pink-700 hover:bg-pink-100',
};

export function RelatedChips({ links }: RelatedChipsProps) {
  if (links.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">Related:</span>
      {links.map((link) => (
        <Link
          key={`${link.type}-${link.id}`}
          href={link.href}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${objectColors[link.type]}`}
        >
          {objectIcons[link.type]}
          <span>{link.label}</span>
        </Link>
      ))}
    </div>
  );
}
