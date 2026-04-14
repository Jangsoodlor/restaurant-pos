import { userApiClient, tableApiClient } from "./src/api/client";
async function run() {
  const token = await userApiClient.loginUserUserLoginPost({
    userLogin: { name: "test_admin", password: "mocked_hash" } // Or whatever credentials
  });
  console.log("Token:", token.access_token);
}
run();
