import { supabase } from '../lib/supabaseClient';
import { Client, RentalHistory } from '../types';

const findClientByEmail = async (email?: string | null): Promise<Client | null> => {
  if (!email) return null;
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .ilike('email', email)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return (data as Client) ?? null;
};

export const userService = {
  getProfile: async (): Promise<Client | null> => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';
    
    if (isDemo) {
      return {
        id: 'demo-client-123',
        name: 'Juan',
        surname: 'Perez Garcia',
        phone: '600 123 456',
        email: 'demo@trasteros.com',
        dni: 'X123456Z',
        address: 'C/ Mayor 123, 2A',
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
    return await findClientByEmail(user.email);
  },

  getRentalHistory: async (): Promise<RentalHistory[]> => {
    const isDemo = localStorage.getItem('demo_mode') === 'true';

    if (isDemo) {
      return [
        { id: 'h1', unit_code: 'A-24', size_m2: 6, start_date: '2023-10-01', end_date: null, status: 'Activo' },
        { id: 'h2', unit_code: 'B-05', size_m2: 3, start_date: '2023-01-15', end_date: '2023-09-30', status: 'Finalizado' },
        { id: 'h3', unit_code: 'Z-10', size_m2: 12, start_date: '2022-05-01', end_date: '2022-12-31', status: 'Finalizado' },
      ];
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const client = await findClientByEmail(user.email);
    if (!client) return [];

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
