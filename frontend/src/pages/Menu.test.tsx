import { describe, it, expect } from 'bun:test';
import Menu from './Menu';

describe('Menu page basic smoke', () => {
  it('Menu exports a component', () => {
    expect(typeof Menu).toBe('function');
  });
});
