import { supabase } from '../lib/supabaseClient';

export const paymentsService = {
  createCheckoutSession: async (unitId: string, priceId: string) => {
    if (localStorage.getItem('demo_mode') === 'true') {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Mock Stripe Checkout URL (redirects back to app)
        return { url: window.location.origin + '/#/app/dashboard?payment_success=true' };
    }

    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: { unit_id: unitId, price_id: priceId, return_url: window.location.origin + '/#/app/dashboard' }
    });

    if (error) throw error;
    return data;
  },

  createPortalSession: async () => {
    if (localStorage.getItem('demo_mode') === 'true') {
        alert('En modo demo no podemos redirigirte a Stripe Billing real.');
        return { url: null };
    }

    const { data, error } = await supabase.functions.invoke('create-customer-portal-session', {
      body: { return_url: window.location.origin + '/#/app/profile' }
    });

    if (error) throw error;
    return data;
  },

  getPaymentHistory: async () => {
    if (localStorage.getItem('demo_mode') === 'true') {
      // Demo: pagos mock
      return [
        {
          id: 'pay-1',
          invoice_id: 'inv-1',
          paid_at: '2023-10-02T10:00:00Z',
          amount: 95.00,
          method: 'CARD',
          notes: '',
          created_at: '2023-10-02T10:00:00Z',
          payment_date: '2023-10-02',
          date: '2023-10-02',
          invoice: {
            id: 'inv-1',
            number: 'FAC-2023-1001',
            amount: 95.00,
            issue_date: '2023-10-01',
            due_date: '2023-10-15',
            status: 'Pagada',
            paid: true,
            client_id: 'demo-client-123',
            unit_code: 'A-24',
          }
        }
      ];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    // Buscar el client_id
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();
    if (!client) return [];
    // Consultar pagos y unir con facturas
    const { data: payments, error } = await supabase
      .from('payments')
      .select('*, invoice:invoices(*)')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return payments;
  }
};