import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('API Client Configuration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('exports API client instances', async () => {
    const { menuApiClient, orderApiClient, userApiClient, tableApiClient } = await import('@/api/client');

    expect(menuApiClient).toBeDefined();
    expect(orderApiClient).toBeDefined();
    expect(userApiClient).toBeDefined();
    expect(tableApiClient).toBeDefined();
  });

  it('API clients have correct base path configured', async () => {
    const { menuApiClient } = await import('@/api/client');

    expect(menuApiClient.configuration?.basePath).toBe('http://localhost:8000');
  });

  it('API clients have fetchApi middleware configured', async () => {
    const { menuApiClient } = await import('@/api/client');

    // Verify that fetchApi (middleware) is configured
    expect(menuApiClient.configuration?.fetchApi).toBeDefined();
    expect(typeof menuApiClient.configuration?.fetchApi).toBe('function');
  });
});
