import { describe, it, expect } from 'bun:test';
import useOrders from './useOrders';

describe('useOrders', () => {
  it('hook exists', () => {
    expect(useOrders).toBeDefined();
    expect(typeof useOrders).toBe('function');
  });
});
