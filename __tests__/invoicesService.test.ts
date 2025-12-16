// Prueba unitaria simple para invoicesService adaptado a invoices_view
import { describe, it, expect } from 'vitest';
import { invoicesService } from '../services/invoicesService';

describe('invoicesService adaptado a invoices_view', () => {
  it('getMyInvoices demo debe devolver facturas mock', async () => {
    localStorage.setItem('demo_mode', 'true');
    const invoices = await invoicesService.getMyInvoices();
    expect(invoices.length).toBeGreaterThan(0);
    expect(invoices[0]).toHaveProperty('number');
    expect(invoices[0]).toHaveProperty('unit_code');
    localStorage.removeItem('demo_mode');
  });
});
