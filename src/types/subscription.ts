export type SubscriptionPlan = 'free' | 'plus' | 'premium';

export interface UserSubscription {
  type: 'free' | 'pro';
  features: ProFeature[];
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'cancelled' | 'expired';
}

export const PRO_FEATURES = {
  DASHBOARD: 'dashboard',
  EDIT_TRANSACTION: 'edit_transaction',
  MANAGE_CATEGORIES: 'manage_categories',
  EXPORT_DATA: 'export_data',
  ATTACHMENTS: 'attachments'
} as const;

export type ProFeature = 
  | 'unlimited_transactions'
  | 'advanced_reports'
  | 'custom_categories'
  | 'data_export';

export function hasProAccess(userSubscription: UserSubscription | null): boolean {
  if (!userSubscription) return false;
  return (userSubscription.type === 'plus' || userSubscription.type === 'premium') && userSubscription.status === 'active';
}

export function canAccessFeature(subscription: UserSubscription | null, feature: ProFeature): boolean {
  if (!subscription) return false;
  if (subscription.status !== 'active') return false;
  if (subscription.endDate && subscription.endDate < new Date()) return false;
  return subscription.features.includes(feature);
} 