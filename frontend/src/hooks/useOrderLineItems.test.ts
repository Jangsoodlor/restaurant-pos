import { describe, it, expect } from 'bun:test';
import useOrderLineItems from './useOrderLineItems';

describe('useOrderLineItems', () => {
  it('hook exists', () => {
    expect(useOrderLineItems).toBeDefined();
    expect(typeof useOrderLineItems).toBe('function');
  });
});
