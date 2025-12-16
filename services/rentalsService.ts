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
    if (!user || !user.email) return null;
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id')
      .ilike('email', user.email)
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
    if (data?.unit) {
      data.unit = {
        ...data.unit,
        name: data.unit.name ?? `Trastero ${data.unit.code}`,
        price_monthly: data.unit.price ?? data.unit.price_monthly
      };
    }
    return data as Rental;
  },

  requestCancellation: async (rentalId: string, reason: string) => {
    if (localStorage.getItem('demo_mode') === 'true') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return;
    }
    const { error } = await supabase
      .from('rentals')
      .update({ status: 'Pendiente' })
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
