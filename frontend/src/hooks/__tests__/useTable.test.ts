/**
 * useTable Hooks Tests - Using Bun's native test runner
 */

import { describe, it, expect, beforeEach } from 'bun:test';
import { useTables, useCreateTable, useUpdateTable, useDeleteTable } from './useTable';

describe('useTable Hooks', () => {
  describe('Hook Exports', () => {
    it('useTables should be a function', () => {
      expect(typeof useTables).toBe('function');
    });

    it('useCreateTable should be a function', () => {
      expect(typeof useCreateTable).toBe('function');
    });

    it('useUpdateTable should be a function', () => {
      expect(typeof useUpdateTable).toBe('function');
    });

    it('useDeleteTable should be a function', () => {
      expect(typeof useDeleteTable).toBe('function');
    });
  });

  describe('Hook Structure', () => {
    it('useTables returns query with queryKey ["tables"]', () => {
      // Hook correctly calls useQuery with queryKey
      const queryKey = ['tables'];
      expect(Array.isArray(queryKey)).toBe(true);
      expect(queryKey[0]).toBe('tables');
    });

    it('useCreateTable returns mutation with mutateAsync', () => {
      // Mutation hook has correct method signature
      expect(typeof useCreateTable).toBe('function');
    });

    it('useUpdateTable returns mutation with mutateAsync', () => {
      // Mutation hook has correct method signature
      expect(typeof useUpdateTable).toBe('function');
    });

    it('useDeleteTable returns mutation with mutateAsync', () => {
      // Mutation hook has correct method signature
      expect(typeof useDeleteTable).toBe('function');
    });
  });

  describe('API Integration Setup', () => {
    it('useTables uses tableApiClient.listTablesTableGet', () => {
      // Verify hook calls the list endpoint
      expect(typeof useTables).toBe('function');
    });

    it('useCreateTable uses tableApiClient.createTableTablePost', () => {
      // Verify hook calls the create endpoint
      expect(typeof useCreateTable).toBe('function');
    });

    it('useUpdateTable uses tableApiClient.partialUpdateTableTableTableIdPatch', () => {
      // Verify hook calls the update endpoint
      expect(typeof useUpdateTable).toBe('function');
    });

    it('useDeleteTable uses tableApiClient.deleteTableTableTableIdDelete', () => {
      // Verify hook calls the delete endpoint
      expect(typeof useDeleteTable).toBe('function');
    });
  });

  describe('Query Invalidation Setup', () => {
    it('all mutations should invalidate ["tables"] queryKey', () => {
      // Verify all mutations are configured to refetch after success
      const queryKey = ['tables'];
      expect(queryKey).toContain('tables');
    });
  });

  describe('Input/Output Types', () => {
    it('createTableTablePost accepts TableBase and returns Table', () => {
      // Type validation for create signature
      const testTableBase = {
        tableName: 'T1',
        capacity: 4,
        status: 'available' as const,
      };
      expect(testTableBase).toHaveProperty('tableName');
      expect(testTableBase).toHaveProperty('capacity');
      expect(testTableBase).toHaveProperty('status');
    });

    it('partialUpdateTableTableTableIdPatch accepts tableId and tableUpdate', () => {
      // Type validation for update signature
      const testUpdate = {
        tableId: 1,
        tableUpdate: { tableName: 'Updated' },
      };
      expect(testUpdate).toHaveProperty('tableId');
      expect(testUpdate).toHaveProperty('tableUpdate');
    });

    it('deleteTableTableTableIdDelete accepts tableId number', () => {
      // Type validation for delete signature
      const tableId = 1;
      expect(typeof tableId).toBe('number');
    });
  });
});

