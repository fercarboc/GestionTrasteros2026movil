import { supabase } from '../lib/supabaseClient';
import { SubscriptionStatus } from '../types';

export const subscriptionsService = {
  getSubscriptionStatus: async (): Promise<SubscriptionStatus | null> => {
    const { data, error } = await supabase.functions.invoke('get-subscription-details');
    if (error) return null; // Fallback or handle error
    return data as SubscriptionStatus;
  },

  reactivateSubscription: async () => {
    // Call Edge Function to resume subscription in Stripe
    const { error } = await supabase.functions.invoke('reactivate-subscription');
    if (error) throw error;
  }
};