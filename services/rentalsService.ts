// Servicio para gestionar rentals (alquileres)
import { supabase } from '../lib/supabaseClient';
import { Rental } from '../types';

export const rentalsService = {
  getMyActiveRental: async (): Promise<Rental | null> => {
    if (localStorage.getItem('demo_mode') === 'true') {
      // Retorna un mock de rental activo
      return {
        id: 'demo-rental-uuid',
        unit_id: 'unit-1',
        client_id: 'demo-client-123',
        start_date: '2023-10-01',
        price: 95.0,
        status: 'Activo',
        unit: {
          id: 'unit-1',
          code: 'A-24',
          size_m2: 6,
          price: 95.0,
          status: 'OCUPADO',
          blocked: false
        }
      };
    }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    // Buscar el client_id asociado al usuario autenticado
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();
    if (clientError || !client) return null;
    // Buscar el rental activo de ese cliente
    const { data, error } = await supabase
      .from('rentals')
      .select('*, unit:units(*)')
      .eq('client_id', client.id)
      .eq('status', 'Activo')
      .maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    return data as Rental;
  },

  requestCancellation: async (rentalId: string, reason: string) => {
    if (localStorage.getItem('demo_mode') === 'true') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }
    const { error } = await supabase
      .from('rentals')
      .update({ status: 'Pendiente', cancellation_reason: reason })
      .eq('id', rentalId);
    if (error) throw error;
  },

  getRentalDocumentUrl: async (rentalId: string) => {
    if (localStorage.getItem('demo_mode') === 'true') {
      return '#';
    }
    const { data } = supabase
      .storage
      .from('rentals')
      .getPublicUrl(`${rentalId}.pdf`);
    return data.publicUrl;
  }
};
