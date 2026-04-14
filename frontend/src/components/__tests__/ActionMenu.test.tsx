import { describe, it, expect, mock } from 'bun:test';
import { ActionMenu } from '../ActionMenu';

describe('ActionMenu', () => {
  it('returns a details wrapper element', () => {
    const node = ActionMenu({ onEdit: () => { }, onDelete: () => { } });
    expect(node.type).toBe('details');
  });

  it('accepts both edit and delete handlers', () => {
    const onEdit = mock(() => { });
    const onDelete = mock(() => { });
    const node = ActionMenu({ onEdit, onDelete, ariaLabel: 'Actions for test item' });

    // Traverse the menu children to invoke handlers directly.
    const menu = (node.props.children as any[])[1];
    const items = menu.props.children as any[];
    items[0].props.onClick();
    items[1].props.onClick();

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it('omits delete action when onDelete is omitted', () => {
    const onEdit = mock(() => { });
    const node = ActionMenu({ onEdit, ariaLabel: 'Edit-only actions' });
    const menu = (node.props.children as any[])[1];
    const items = (menu.props.children as any[]).filter(Boolean);

    expect(items.length).toBe(1);
    items[0].props.onClick();
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('sets disabled on summary and action buttons when disabled=true', () => {
    const node = ActionMenu({ onEdit: () => { }, onDelete: () => { }, disabled: true, ariaLabel: 'Disabled actions' });

    const summary = (node.props.children as any[])[0];
    const summaryButton = summary.props.children;
    const menu = (node.props.children as any[])[1];
    const items = menu.props.children as any[];

    expect(summaryButton.props.disabled).toBe(true);
    expect(items[0].props.disabled).toBe(true);
    expect(items[1].props.disabled).toBe(true);
  });
});
