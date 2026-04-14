import { describe, it, expect } from 'bun:test';
import ViewOrder from './viewOrder';

describe('ViewOrder', () => {
  it('component exists', () => {
    expect(ViewOrder).toBeDefined();
    expect(typeof ViewOrder).toBe('function');
  });
});
