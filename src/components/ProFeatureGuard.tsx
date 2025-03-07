'use client';

import { useSubscription } from '@/contexts/SubscriptionContext';
import { ProFeature, PRO_FEATURES } from '@/types/subscription';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProFeatureGuardProps {
  feature: ProFeature;
  children: React.ReactNode;
}

export function ProFeatureGuard({ feature, children }: ProFeatureGuardProps) {
  const { canAccessFeature, loading } = useSubscription();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !canAccessFeature(feature)) {
      router.push('/upgrade');
    }
  }, [loading, canAccessFeature, feature, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!canAccessFeature(feature)) {
    return null;
  }

  return <>{children}</>;
} 