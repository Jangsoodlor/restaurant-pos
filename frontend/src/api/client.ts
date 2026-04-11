import { Configuration, MenuApi, OrderApi, UserApi, TableApi } from "./stub";

// 1. Set up the base config
const apiConfig = new Configuration({
  basePath: 'http://localhost:8000', // Your FastAPI backend URL
  // TODO: add fetch middleware here later for auth tokens ONCE auth is implemented.
});

// 2. Initialize the generated API classes with the config
export const menuApiClient = new MenuApi(apiConfig);
export const orderApiClient = new OrderApi(apiConfig);
export const userApiClient = new UserApi(apiConfig);
export const tableApiClient = new TableApi(apiConfig)
