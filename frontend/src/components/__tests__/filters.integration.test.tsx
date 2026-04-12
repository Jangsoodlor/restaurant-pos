import { describe, it, expect, afterEach } from 'bun:test';
import 'happy-dom';
import { Window } from 'happy-dom';
const __window = new Window();
globalThis.window = __window as any;
globalThis.document = __window.document as any;
globalThis.HTMLElement = __window.HTMLElement as any;
globalThis.getComputedStyle = __window.getComputedStyle as any;
globalThis.requestAnimationFrame = __window.requestAnimationFrame as any;
(__window as any).SyntaxError = SyntaxError;
globalThis.SyntaxError = SyntaxError;
if (!globalThis.document.body) {
  const body = globalThis.document.createElement('body');
  globalThis.document.appendChild(body);
}
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { NameSearchFilter } from '@/components/NameSearchFilter';
import { PriceRangeFilter } from '@/components/PriceRangeFilter';
import { SortDropdown } from '@/components/SortDropdown';

afterEach(() => cleanup());

describe('Filter components integration', () => {
  it('NameSearchFilter updates on input', () => {
    let value = '';
    const { getByLabelText } = render(<NameSearchFilter value={value} onChange={(v) => { value = v; }} />);
    const input = getByLabelText(/name/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Burger' } });
    expect((input as HTMLInputElement).value).toBe('Burger');
  });

  it('PriceRangeFilter updates min/max inputs', () => {
    let state: any = { min: '', max: '' };
    const { getByLabelText: getByLabel } = render(<PriceRangeFilter min={''} max={''} onChange={(v) => { state = { ...state, ...v }; }} />);
    const minInput = getByLabel(/price \(min\)/i) as HTMLInputElement;
    const maxInput = getByLabel(/price \(max\)/i) as HTMLInputElement;
    fireEvent.change(minInput, { target: { value: '100' } });
    fireEvent.change(maxInput, { target: { value: '500' } });
    expect(minInput.value).toBe('100');
    expect(maxInput.value).toBe('500');
  });

  it('SortDropdown reflects selection', () => {
    let val: any = 'none';
    const { getByLabelText: getByLabelTextSelect } = render(<SortDropdown value={val} onChange={(v) => { val = v; }} />);
    const select = getByLabelTextSelect(/sort/i) as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'asc' } });
    expect(val).toBe('asc');
  });
});
