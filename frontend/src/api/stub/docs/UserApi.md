# UserApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createUserUserPost**](UserApi.md#createuseruserpost) | **POST** /user/ | Create User |
| [**deleteUserUserUserIdDelete**](UserApi.md#deleteuseruseruseriddelete) | **DELETE** /user/{user_id} | Delete User |
| [**listUsersUserGet**](UserApi.md#listusersuserget) | **GET** /user/ | List Users |
| [**loginUserUserLoginPost**](UserApi.md#loginuseruserloginpost) | **POST** /user/login | Login User |
| [**partialUpdateUserUserUserIdPatch**](UserApi.md#partialupdateuseruseruseridpatch) | **PATCH** /user/{user_id} | Partial Update User |
| [**registerUserUserRegisterPost**](UserApi.md#registeruseruserregisterpost) | **POST** /user/register | Register User |
| [**retrieveUserUserUserIdGet**](UserApi.md#retrieveuseruseruseridget) | **GET** /user/{user_id} | Retrieve User |



## createUserUserPost

> UserRead createUserUserPost(userCreate)

Create User

Create a new user.

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { CreateUserUserPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserApi(config);

  const body = {
    // UserCreate
    userCreate: ...,
  } satisfies CreateUserUserPostRequest;

  try {
    const data = await api.createUserUserPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userCreate** | [UserCreate](UserCreate.md) |  | |

### Return type

[**UserRead**](UserRead.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteUserUserUserIdDelete

> deleteUserUserUserIdDelete(userId)

Delete User

Delete a user by ID.

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { DeleteUserUserUserIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserApi(config);

  const body = {
    // number
    userId: 56,
  } satisfies DeleteUserUserUserIdDeleteRequest;

  try {
    const data = await api.deleteUserUserUserIdDelete(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `number` |  | [Defaults to `undefined`] |

### Return type

`void` (Empty response body)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **204** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## listUsersUserGet

> Array&lt;UserRead&gt; listUsersUserGet(offset, limit, role)

List Users

Get all users with pagination.

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { ListUsersUserGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserApi(config);

  const body = {
    // number (optional)
    offset: 56,
    // number (optional)
    limit: 56,
    // Role (optional)
    role: ...,
  } satisfies ListUsersUserGetRequest;

  try {
    const data = await api.listUsersUserGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **offset** | `number` |  | [Optional] [Defaults to `0`] |
| **limit** | `number` |  | [Optional] [Defaults to `100`] |
| **role** | `Role` |  | [Optional] [Defaults to `undefined`] [Enum: waiter, cook, manager] |

### Return type

[**Array&lt;UserRead&gt;**](UserRead.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## loginUserUserLoginPost

> Token loginUserUserLoginPost(userLogin)

Login User

Authenticate user and return JWT access token.

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { LoginUserUserLoginPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // UserLogin
    userLogin: ...,
  } satisfies LoginUserUserLoginPostRequest;

  try {
    const data = await api.loginUserUserLoginPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userLogin** | [UserLogin](UserLogin.md) |  | |

### Return type

[**Token**](Token.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## partialUpdateUserUserUserIdPatch

> UserRead partialUpdateUserUserUserIdPatch(userId, userUpdate)

Partial Update User

Partially update a user (only provided fields).

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { PartialUpdateUserUserUserIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserApi(config);

  const body = {
    // number
    userId: 56,
    // UserUpdate
    userUpdate: ...,
  } satisfies PartialUpdateUserUserUserIdPatchRequest;

  try {
    const data = await api.partialUpdateUserUserUserIdPatch(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `number` |  | [Defaults to `undefined`] |
| **userUpdate** | [UserUpdate](UserUpdate.md) |  | |

### Return type

[**UserRead**](UserRead.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## registerUserUserRegisterPost

> UserRead registerUserUserRegisterPost(userCreate)

Register User

Register a new user.

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { RegisterUserUserRegisterPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const api = new UserApi();

  const body = {
    // UserCreate
    userCreate: ...,
  } satisfies RegisterUserUserRegisterPostRequest;

  try {
    const data = await api.registerUserUserRegisterPost(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userCreate** | [UserCreate](UserCreate.md) |  | |

### Return type

[**UserRead**](UserRead.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **201** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## retrieveUserUserUserIdGet

> UserRead retrieveUserUserUserIdGet(userId)

Retrieve User

Get a single user by ID.

### Example

```ts
import {
  Configuration,
  UserApi,
} from '';
import type { RetrieveUserUserUserIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new UserApi(config);

  const body = {
    // number
    userId: 56,
  } satisfies RetrieveUserUserUserIdGetRequest;

  try {
    const data = await api.retrieveUserUserUserIdGet(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **userId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**UserRead**](UserRead.md)

### Authorization

[OAuth2PasswordBearer password](../README.md#OAuth2PasswordBearer-password)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `application/json`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | Successful Response |  -  |
| **422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

