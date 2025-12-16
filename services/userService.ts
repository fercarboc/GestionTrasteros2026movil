import { supabase } from '../lib/supabaseClient';
import { Client, RentalHistory, Rental, Unit } from '../types';

export const userService = {
  // Busca el client por auth_user_id
  getProfile: async (): Promise<Client | null> => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemo) {
      return {
        id: 'demo-client-123',
        name: 'Juan',
        surname: 'Pérez García',
        phone: '600 123 456',
        email: 'demo@trasteros.com',
        dni: 'X123456Z',
        address: 'C/ Mayor 123, 2ºA',
        city: 'Madrid',
        postal_code: '28001',
        province: 'Madrid',
        iban: 'ES12345678901234567890',
        notes: '',
        rating_count: 0,
        rating_avg: 0
      };
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Buscar el client por auth_user_id
    const { data } = await supabase
      .from('clients')
      .select('*')
      .eq('auth_user_id', user.id)
      .maybeSingle();
    if (!data) return null;
    return data as Client;
  },

  // Devuelve el historial de rentals del cliente autenticado
  getRentalHistory: async (): Promise<RentalHistory[]> => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';

    if (isDemo) {
      return [
        { id: 'h1', unit_code: 'A-24', size_m2: 6, start_date: '2023-10-01', end_date: null, status: 'Activo' },
        { id: 'h2', unit_code: 'B-05', size_m2: 3, start_date: '2023-01-15', end_date: '2023-09-30', status: 'Finalizado' },
        { id: 'h3', unit_code: 'Z-10', size_m2: 12, start_date: '2022-05-01', end_date: '2022-12-31', status: 'Finalizado' },
      ];
    }

    // Real DB fetch
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    // Buscar el client_id
    const { data: client } = await supabase
      .from('clients')
      .select('id')
      .eq('auth_user_id', user.id)
      .maybeSingle();
    if (!client) return [];
    // Buscar rentals históricos
    const { data: rentals } = await supabase
      .from('rentals')
      .select('id, start_date, end_date, status, unit:units(code, size_m2)')
      .eq('client_id', client.id)
      .order('start_date', { ascending: false });
    return rentals?.map((r: any) => ({
      id: r.id,
      unit_code: r.unit?.code,
      size_m2: r.unit?.size_m2,
      start_date: r.start_date,
      end_date: r.end_date,
      status: r.status as RentalHistory['status']
    })) || [];
  }
};