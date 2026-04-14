# User Authentication: Part 1

There is already a /user/ endpoint in the backend that is used for CRUD operation with the user. Now I want it to be the endpoint that implement login/logout/account creation

## Your tasks

1. Create the following pages on the frontend
1.1. Account creation page: that let visitor registor as cook, manager, or waiter (see /src/api/stub/models/Role.ts for the exact strings).
1.2. Login page: Let user login
1.3. Login page should contain a hyperlink to account creation page, and vice versa.

2. Implement full-flow login/logout/account creation with the backend
2.1 Modify the `user` module in the backend to handle password storing, authentication, and authorisation.

3. Keep user id, username, and user role in the frontend session.

4. Make all endpoints except GET /table/ and GET /table/{id} accessible only to users with valid JWT credentials
5. If a visitor visit `localhost:3000`, direct them to the account creation/login page first.

## Non-goals

1. Role-based access controls. This shall be done in the next iteration
