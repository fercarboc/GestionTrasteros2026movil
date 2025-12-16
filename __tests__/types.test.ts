// Prueba unitaria simple para los nuevos tipos generados
import { describe, it, expect } from 'vitest';
import { Client, Unit, Rental, Invoice, Payment, RentalStatus, UnitStatus } from '../types';

describe('Modelos de tipos Supabase', () => {
  it('debería crear un cliente válido', () => {
    const client: Client = {
      id: 'uuid',
      name: 'Juan',
      rating_count: 0,
      rating_avg: 0,
    };
    expect(client.name).toBe('Juan');
  });

  it('debería crear un rental válido', () => {
    const rental: Rental = {
      id: 'uuid',
      unit_id: 'unit-uuid',
      client_id: 'client-uuid',
      start_date: '2024-01-01',
      price: 100,
      status: 'Activo',
    };
    expect(rental.status).toBe('Activo');
  });

  it('debería aceptar estados válidos', () => {
    const status: RentalStatus = 'Cancelado';
    expect(['Activo', 'Cancelado', 'Pendiente', 'Finalizado']).toContain(status);
  });

  it('debería crear una unidad válida', () => {
    const unit: Unit = {
      id: 'uuid',
      code: 'A-101',
      size_m2: 10,
      price: 50,
      status: 'DISPONIBLE',
      blocked: false,
    };
    expect(unit.status).toBe('DISPONIBLE');
  });
});
