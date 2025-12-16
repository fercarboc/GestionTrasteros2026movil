import { supabase } from '../lib/supabaseClient';
import { Invoice } from '../types';



export const invoicesService = {

  getMyInvoices: async (): Promise<Invoice[]> => {
    if (localStorage.getItem('demo_mode') === 'true') {
      // Demo: devolver facturas mock
      return [
        {
          id: 'inv-1',
          number: 'FAC-2023-1001',
          amount: 95.00,
          issue_date: '2023-10-01',
          due_date: '2023-10-15',
          status: 'Pagada',
          paid: true,
          client_id: 'demo-client-123',
          unit_code: 'A-24',
        },
        {
          id: 'inv-2',
          number: 'FAC-2023-0945',
          amount: 95.00,
          issue_date: '2023-09-01',
          due_date: '2023-09-15',
          status: 'Pagada',
          paid: true,
          client_id: 'demo-client-123',
          unit_code: 'A-24',
        },
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
    // Consultar invoices_view filtrando por client_id
    const { data, error } = await supabase
      .from('invoices_view')
      .select('*')
      .eq('client_id', client.id)
      .order('issue_date', { ascending: false });
    if (error) throw error;
    return data as Invoice[];
  },

    // Eliminado createMockInvoice: ahora solo datos reales o demo
};