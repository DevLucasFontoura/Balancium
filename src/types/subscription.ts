export type SubscriptionPlan = 'free' | 'plus' | 'premium';

export interface UserSubscription {
  plan: SubscriptionPlan;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
}

export const PRO_FEATURES = {
  DASHBOARD: 'dashboard',
  EDIT_TRANSACTION: 'edit_transaction',
  MANAGE_CATEGORIES: 'manage_categories',
  EXPORT_DATA: 'export_data',
  ATTACHMENTS: 'attachments'
} as const;

export type ProFeature = typeof PRO_FEATURES[keyof typeof PRO_FEATURES];

export function hasProAccess(userSubscription: UserSubscription | null): boolean {
  if (!userSubscription) return false;
  return (userSubscription.plan === 'plus' || userSubscription.plan === 'premium') && userSubscription.isActive;
}

export function canAccessFeature(userSubscription: UserSubscription | null, feature: ProFeature): boolean {
  if (!userSubscription || !userSubscription.isActive) return false;
  
  // Premium features
  if (feature === PRO_FEATURES.ATTACHMENTS) {
    return userSubscription.plan === 'premium';
  }
  
  // Plus features
  return userSubscription.plan === 'plus' || userSubscription.plan === 'premium';
} 