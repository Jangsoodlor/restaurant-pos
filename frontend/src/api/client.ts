import { Configuration, MenuApi, OrderApi, UserApi, TableApi } from "./stub";

// 1. Set up the base config
const apiBase = (import.meta && import.meta.env && import.meta.env.API_BASE) || 'http://localhost:8000';

const apiConfig = new Configuration({
  basePath: apiBase, // read from frontend/.env via API_BASE
  accessToken: () => {
    const token = localStorage.getItem('auth_token');
    return token ? `Bearer ${token}` : '';
  },
});

// 2. Initialize the generated API classes with the config
export const menuApiClient = new MenuApi(apiConfig);
export const orderApiClient = new OrderApi(apiConfig);
export const userApiClient = new UserApi(apiConfig);
export const tableApiClient = new TableApi(apiConfig);
