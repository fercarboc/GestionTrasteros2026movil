// Tipos generados a partir del esquema real de Supabase (rentals, clients, units, invoices, payments)

export interface Client {
  id: string;
  name: string;
  surname?: string;
  phone?: string;
  email?: string;
  dni?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  iban?: string;
  notes?: string;
  rating_count: number;
  rating_avg: number;
}

export interface Unit {
  id: string;
  code: string;
  size_m2: number;
  price: number;
  status: UnitStatus;
  // Campos adicionales usados por la UI actual (legacy)
  name?: string;
  price_monthly?: number;
  location?: string;
  features?: string[];
  image_url?: string;
  notes?: string;
  created_at?: string;
  blocked: boolean;
  type?: string;
  ground_floor?: boolean;
  unit_type_id?: string;
  floor?: number;
}

export type UnitStatus = 'DISPONIBLE' | 'OCUPADO' | 'MANTENIMIENTO';

export interface Rental {
  id: string;
  unit_id: string;
  client_id: string;
  start_date: string;
  end_date?: string | null;
  price: number;
  deposit?: number;
  status: RentalStatus;
  deposit_returned?: boolean;
  deposit_return_date?: string | null;
  deposit_return_method?: string | null;
  payment_method?: string;
  duration?: string;
  created_at?: string;
  unit?: Unit; // Join opcional
}

export type RentalStatus = 'Activo' | 'Cancelado' | 'Pendiente' | 'Finalizado';

export interface Invoice {
  id: string;
  rental_id?: string;
  client_id?: string;
  unit_id?: string;
  number?: string;
  amount?: number;
  issue_date?: string;
  due_date?: string;
  status?: string;
  notes?: string;
  paid?: boolean;
  period_month?: string;
  created_at?: string;
  client_name?: string;
  unit_code?: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  paid_at: string;
  amount: number;
  method?: string;
  notes?: string;
  created_at?: string;
  payment_date: string;
  date: string;
}

// Helpers
export type RentalHistory = {
  id: string;
  unit_code: string;
  size_m2: number;
  start_date: string;
  end_date: string | null;
  status: RentalStatus;
};
