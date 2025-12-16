// Prueba unitaria simple para userService adaptado a clients
import { describe, it, expect } from 'vitest';
import { userService } from '../services/userService';

describe('userService adaptado a clients', () => {
  it('getProfile demo debe devolver un Client válido', async () => {
    localStorage.setItem('demo_mode', 'true');
    const profile = await userService.getProfile();
    expect(profile?.name).toBe('Juan');
    expect(profile?.email).toBe('demo@trasteros.com');
    localStorage.removeItem('demo_mode');
  });

  it('getRentalHistory demo debe devolver historial mock', async () => {
    localStorage.setItem('demo_mode', 'true');
    const history = await userService.getRentalHistory();
    expect(history.length).toBeGreaterThan(0);
    expect(history[0]).toHaveProperty('unit_code');
    localStorage.removeItem('demo_mode');
  });
});
