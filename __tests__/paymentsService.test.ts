// Prueba unitaria simple para paymentsService adaptado a pagos reales
import { describe, it, expect } from 'vitest';
import { paymentsService } from '../services/paymentsService';

describe('paymentsService adaptado a pagos reales', () => {
  it('getPaymentHistory demo debe devolver pagos mock', async () => {
    localStorage.setItem('demo_mode', 'true');
    const payments = await paymentsService.getPaymentHistory();
    expect(payments.length).toBeGreaterThan(0);
    expect(payments[0]).toHaveProperty('invoice');
    expect(payments[0].invoice).toHaveProperty('number');
    localStorage.removeItem('demo_mode');
  });
});
