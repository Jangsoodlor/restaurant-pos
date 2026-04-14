import { describe, it, expect } from 'bun:test';
import { useMenuModifiers } from '../useMenuModifiers';

describe('useMenuModifiers hook (smoke)', () => {
  it('exports a function', () => {
    expect(typeof useMenuModifiers).toBe('function');
  });
});
