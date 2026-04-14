import { describe, it, expect } from 'bun:test';
import { 
  canAccessPage, 
  canCreate, 
  canDelete, 
  canEdit, 
  canEditField,
  canPerformAnyAction,
  PERMISSIONS 
} from '@/utils/permissions';

describe('Permission Helpers', () => {
  describe('canAccessPage', () => {
    it('allows manager to access all pages', () => {
      expect(canAccessPage('user', 'manager')).toBe(true);
      expect(canAccessPage('tableStatus', 'manager')).toBe(true);
      expect(canAccessPage('menu', 'manager')).toBe(true);
    });

    it('allows waiter to access non-user pages', () => {
      expect(canAccessPage('user', 'waiter')).toBe(false);
      expect(canAccessPage('tableStatus', 'waiter')).toBe(true);
      expect(canAccessPage('menu', 'waiter')).toBe(true);
    });

    it('allows cook to access non-user pages', () => {
      expect(canAccessPage('user', 'cook')).toBe(false);
      expect(canAccessPage('tableStatus', 'cook')).toBe(true);
      expect(canAccessPage('menu', 'cook')).toBe(true);
    });

    it('returns false when role is null', () => {
      expect(canAccessPage('user', null)).toBe(false);
      expect(canAccessPage('tableStatus', null)).toBe(false);
      expect(canAccessPage('menu', null)).toBe(false);
    });
  });

  describe('canCreate', () => {
    it('allows only manager to create on tableStatus', () => {
      expect(canCreate('tableStatus', 'manager')).toBe(true);
      expect(canCreate('tableStatus', 'waiter')).toBe(false);
      expect(canCreate('tableStatus', 'cook')).toBe(false);
      expect(canCreate('tableStatus', null)).toBe(false);
    });

    it('allows only manager to create on menu', () => {
      expect(canCreate('menu', 'manager')).toBe(true);
      expect(canCreate('menu', 'waiter')).toBe(false);
      expect(canCreate('menu', 'cook')).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('allows only manager to delete on tableStatus', () => {
      expect(canDelete('tableStatus', 'manager')).toBe(true);
      expect(canDelete('tableStatus', 'waiter')).toBe(false);
      expect(canDelete('tableStatus', 'cook')).toBe(false);
      expect(canDelete('tableStatus', null)).toBe(false);
    });

    it('allows only manager to delete on menu', () => {
      expect(canDelete('menu', 'manager')).toBe(true);
      expect(canDelete('menu', 'waiter')).toBe(false);
      expect(canDelete('menu', 'cook')).toBe(false);
    });
  });

  describe('canEdit', () => {
    it('allows manager and waiter to edit on tableStatus', () => {
      expect(canEdit('tableStatus', 'manager')).toBe(true);
      expect(canEdit('tableStatus', 'waiter')).toBe(true);
      expect(canEdit('tableStatus', 'cook')).toBe(false);
      expect(canEdit('tableStatus', null)).toBe(false);
    });

    it('allows only manager to edit on menu', () => {
      expect(canEdit('menu', 'manager')).toBe(true);
      expect(canEdit('menu', 'waiter')).toBe(false);
      expect(canEdit('menu', 'cook')).toBe(false);
    });
  });

  describe('canEditField', () => {
    it('allows manager to edit all table fields', () => {
      expect(canEditField('tableStatus', 'tableName', 'manager')).toBe(true);
      expect(canEditField('tableStatus', 'capacity', 'manager')).toBe(true);
      expect(canEditField('tableStatus', 'status', 'manager')).toBe(true);
      expect(canEditField('tableStatus', 'id', 'manager')).toBe(false); // id is never editable
    });

    it('allows waiter to edit only status field on tables', () => {
      expect(canEditField('tableStatus', 'tableName', 'waiter')).toBe(false);
      expect(canEditField('tableStatus', 'capacity', 'waiter')).toBe(false);
      expect(canEditField('tableStatus', 'status', 'waiter')).toBe(true);
      expect(canEditField('tableStatus', 'id', 'waiter')).toBe(false);
    });

    it('does not allow cook to edit any table fields', () => {
      expect(canEditField('tableStatus', 'tableName', 'cook')).toBe(false);
      expect(canEditField('tableStatus', 'capacity', 'cook')).toBe(false);
      expect(canEditField('tableStatus', 'status', 'cook')).toBe(false);
      expect(canEditField('tableStatus', 'id', 'cook')).toBe(false);
    });

    it('returns false when role is null', () => {
      expect(canEditField('tableStatus', 'tableName', null)).toBe(false);
      expect(canEditField('tableStatus', 'status', null)).toBe(false);
    });
  });

  describe('canPerformAnyAction', () => {
    it('returns true for roles that can perform any CUD action', () => {
      expect(canPerformAnyAction('tableStatus', 'manager')).toBe(true);
      expect(canPerformAnyAction('tableStatus', 'waiter')).toBe(true);
      expect(canPerformAnyAction('tableStatus', 'cook')).toBe(false);
      expect(canPerformAnyAction('menu', 'manager')).toBe(true);
      expect(canPerformAnyAction('menu', 'waiter')).toBe(false);
      expect(canPerformAnyAction('menu', 'cook')).toBe(false);
    });

    it('returns false when role is null', () => {
      expect(canPerformAnyAction('tableStatus', null)).toBe(false);
      expect(canPerformAnyAction('menu', null)).toBe(false);
    });
  });
});
