import { supabase } from '../lib/supabaseClient';
import { Unit } from '../types';

const normalizeUnit = (raw: any): Unit => ({
  id: raw.id,
  code: raw.code,
  size_m2: Number(raw.size_m2 ?? 0),
  price: Number(raw.price ?? 0),
  status: raw.status,
  notes: raw.notes ?? undefined,
  created_at: raw.created_at ?? undefined,
  blocked: Boolean(raw.blocked),
  type: raw.type ?? undefined,
  ground_floor: raw.ground_floor ?? undefined,
  unit_type_id: raw.unit_type_id ?? undefined,
  floor: raw.floor ?? undefined,
  // Campos usados por la UI del portal cliente
  name: `Trastero ${raw.code}`,
  price_monthly: Number(raw.price ?? 0),
  location: raw.floor ? `Planta ${raw.floor}` : undefined,
  features: [],
  image_url: raw.image_url ?? undefined,
});

export const unitsService = {
  getAvailableUnits: async (): Promise<Unit[]> => {
    // Demo Mode Check
    if (localStorage.getItem('demo_mode') === 'true') {
        return [
            { id: 'u1', name: 'Trastero S', size_m2: 3, price_monthly: 45, status: 'DISPONIBLE', location: 'Planta 1', features: ['Cámara 24h', 'Acceso App'] },
            { id: 'u2', name: 'Trastero M', size_m2: 5, price_monthly: 75, status: 'DISPONIBLE', location: 'Planta 1', features: ['Cámara 24h', 'Acceso App', 'Luz'] },
            { id: 'u3', name: 'Trastero L', size_m2: 8, price_monthly: 120, status: 'DISPONIBLE', location: 'Planta 0', features: ['Acceso Vehículo', 'Luz', 'Enchufe'] },
            { id: 'u4', name: 'Trastero XL', size_m2: 12, price_monthly: 160, status: 'DISPONIBLE', location: 'Planta 0', features: ['Acceso Vehículo', 'Luz', 'Doble Altura'] },
        ];
    }

    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('status', 'DISPONIBLE')
      .eq('blocked', false);
    
    if (error) throw error;
    return (data ?? []).map(normalizeUnit);
  },

  getUnitById: async (id: string): Promise<Unit | null> => {
     if (localStorage.getItem('demo_mode') === 'true') {
         return { id, name: 'Trastero Demo', size_m2: 5, price_monthly: 75, status: 'DISPONIBLE', location: 'Demo', features: [] };
     }

    const { data, error } = await supabase
      .from('units')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data ? normalizeUnit(data) : null;
  }
};

