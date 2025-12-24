'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Root page redirects to company workspace
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to demo company home
    router.replace('/company/demo/home');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">U</span>
        </div>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-slate-500">Loading Unbound...</p>
      </div>
    </div>
  );
}
