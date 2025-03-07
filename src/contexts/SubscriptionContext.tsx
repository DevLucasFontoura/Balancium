'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { UserSubscription, canAccessFeature, ProFeature } from '@/types/subscription';

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  loading: boolean;
  canAccessFeature: (feature: ProFeature) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType>({
  subscription: null,
  loading: true,
  canAccessFeature: () => false,
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.subscription) {
            setSubscription({
              ...userData.subscription,
              startDate: userData.subscription.startDate.toDate(),
              endDate: userData.subscription.endDate?.toDate(),
            });
          }
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, []);

  const checkFeatureAccess = (feature: ProFeature) => {
    return canAccessFeature(subscription, feature);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        loading,
        canAccessFeature: checkFeatureAccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  return useContext(SubscriptionContext);
} 