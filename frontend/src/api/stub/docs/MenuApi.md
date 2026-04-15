# MenuApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createMenuItemMenuItemPost**](MenuApi.md#createmenuitemmenuitempost) | **POST** /menu/item/ | Create Menu Item |
| [**createModifierMenuModifierPost**](MenuApi.md#createmodifiermenumodifierpost) | **POST** /menu/modifier/ | Create Modifier |
| [**deleteMenuItemMenuItemMenuItemIdDelete**](MenuApi.md#deletemenuitemmenuitemmenuitemiddelete) | **DELETE** /menu/item/{menu_item_id} | Delete Menu Item |
| [**deleteModifierMenuModifierModifierIdDelete**](MenuApi.md#deletemodifiermenumodifiermodifieriddelete) | **DELETE** /menu/modifier/{modifier_id} | Delete Modifier |
| [**listModifiersMenuModifierGet**](MenuApi.md#listmodifiersmenumodifierget) | **GET** /menu/modifier/ | List Modifiers |
| [**listTablesMenuItemGet**](MenuApi.md#listtablesmenuitemget) | **GET** /menu/item/ | List Tables |
| [**partialUpdateItemMenuItemMenuItemIdPatch**](MenuApi.md#partialupdateitemmenuitemmenuitemidpatch) | **PATCH** /menu/item/{menu_item_id} | Partial Update Item |
| [**partialUpdateModifierMenuModifierModifierIdPatch**](MenuApi.md#partialupdatemodifiermenumodifiermodifieridpatch) | **PATCH** /menu/modifier/{modifier_id} | Partial Update Modifier |
| [**retrieveMenuItemMenuItemMenuItemIdGet**](MenuApi.md#retrievemenuitemmenuitemmenuitemidget) | **GET** /menu/item/{menu_item_id} | Retrieve Menu Item |
| [**retrieveModifierMenuModifierModifierIdGet**](MenuApi.md#retrievemodifiermenumodifiermodifieridget) | **GET** /menu/modifier/{modifier_id} | Retrieve Modifier |



## createMenuItemMenuItemPost

> MenuItem createMenuItemMenuItemPost(menuBase)

Create Menu Item

Create a new menu item.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { CreateMenuItemMenuItemPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // MenuBase
    menuBase: ...,
  } satisfies CreateMenuItemMenuItemPostRequest;

  try {
    const data = await api.createMenuItemMenuItemPost(body);
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
| **menuBase** | [MenuBase](MenuBase.md) |  | |

### Return type

[**MenuItem**](MenuItem.md)

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


## createModifierMenuModifierPost

> MenuItem createModifierMenuModifierPost(menuBase)

Create Modifier

Create a new menu modifier.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { CreateModifierMenuModifierPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // MenuBase
    menuBase: ...,
  } satisfies CreateModifierMenuModifierPostRequest;

  try {
    const data = await api.createModifierMenuModifierPost(body);
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
| **menuBase** | [MenuBase](MenuBase.md) |  | |

### Return type

[**MenuItem**](MenuItem.md)

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


## deleteMenuItemMenuItemMenuItemIdDelete

> deleteMenuItemMenuItemMenuItemIdDelete(menuItemId)

Delete Menu Item

Delete a menu item by ID.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { DeleteMenuItemMenuItemMenuItemIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number
    menuItemId: 56,
  } satisfies DeleteMenuItemMenuItemMenuItemIdDeleteRequest;

  try {
    const data = await api.deleteMenuItemMenuItemMenuItemIdDelete(body);
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
| **menuItemId** | `number` |  | [Defaults to `undefined`] |

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


## deleteModifierMenuModifierModifierIdDelete

> deleteModifierMenuModifierModifierIdDelete(modifierId)

Delete Modifier

Delete a menu modifier by ID.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { DeleteModifierMenuModifierModifierIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number
    modifierId: 56,
  } satisfies DeleteModifierMenuModifierModifierIdDeleteRequest;

  try {
    const data = await api.deleteModifierMenuModifierModifierIdDelete(body);
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
| **modifierId** | `number` |  | [Defaults to `undefined`] |

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


## listModifiersMenuModifierGet

> Array&lt;MenuItem&gt; listModifiersMenuModifierGet(offset, limit)

List Modifiers

Get all menu modifiers with pagination.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { ListModifiersMenuModifierGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number (optional)
    offset: 56,
    // number (optional)
    limit: 56,
  } satisfies ListModifiersMenuModifierGetRequest;

  try {
    const data = await api.listModifiersMenuModifierGet(body);
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
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;MenuItem&gt;**](MenuItem.md)

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


## listTablesMenuItemGet

> Array&lt;MenuItem&gt; listTablesMenuItemGet(offset, limit)

List Tables

Get all menu items with pagination.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { ListTablesMenuItemGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number (optional)
    offset: 56,
    // number (optional)
    limit: 56,
  } satisfies ListTablesMenuItemGetRequest;

  try {
    const data = await api.listTablesMenuItemGet(body);
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
| **limit** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;MenuItem&gt;**](MenuItem.md)

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


## partialUpdateItemMenuItemMenuItemIdPatch

> MenuItem partialUpdateItemMenuItemMenuItemIdPatch(menuItemId, menuUpdate)

Partial Update Item

Partially update a menu item (only provided fields).

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { PartialUpdateItemMenuItemMenuItemIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number
    menuItemId: 56,
    // MenuUpdate
    menuUpdate: ...,
  } satisfies PartialUpdateItemMenuItemMenuItemIdPatchRequest;

  try {
    const data = await api.partialUpdateItemMenuItemMenuItemIdPatch(body);
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
| **menuItemId** | `number` |  | [Defaults to `undefined`] |
| **menuUpdate** | [MenuUpdate](MenuUpdate.md) |  | |

### Return type

[**MenuItem**](MenuItem.md)

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


## partialUpdateModifierMenuModifierModifierIdPatch

> MenuItem partialUpdateModifierMenuModifierModifierIdPatch(modifierId, menuUpdate)

Partial Update Modifier

Partially update a menu modifier (only provided fields).

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { PartialUpdateModifierMenuModifierModifierIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number
    modifierId: 56,
    // MenuUpdate
    menuUpdate: ...,
  } satisfies PartialUpdateModifierMenuModifierModifierIdPatchRequest;

  try {
    const data = await api.partialUpdateModifierMenuModifierModifierIdPatch(body);
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
| **modifierId** | `number` |  | [Defaults to `undefined`] |
| **menuUpdate** | [MenuUpdate](MenuUpdate.md) |  | |

### Return type

[**MenuItem**](MenuItem.md)

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


## retrieveMenuItemMenuItemMenuItemIdGet

> MenuItem retrieveMenuItemMenuItemMenuItemIdGet(menuItemId)

Retrieve Menu Item

Get a single menu item by ID.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { RetrieveMenuItemMenuItemMenuItemIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number
    menuItemId: 56,
  } satisfies RetrieveMenuItemMenuItemMenuItemIdGetRequest;

  try {
    const data = await api.retrieveMenuItemMenuItemMenuItemIdGet(body);
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
| **menuItemId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**MenuItem**](MenuItem.md)

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


## retrieveModifierMenuModifierModifierIdGet

> MenuItem retrieveModifierMenuModifierModifierIdGet(modifierId)

Retrieve Modifier

Get a single menu modifier by ID.

### Example

```ts
import {
  Configuration,
  MenuApi,
} from '';
import type { RetrieveModifierMenuModifierModifierIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new MenuApi(config);

  const body = {
    // number
    modifierId: 56,
  } satisfies RetrieveModifierMenuModifierModifierIdGetRequest;

  try {
    const data = await api.retrieveModifierMenuModifierModifierIdGet(body);
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
| **modifierId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**MenuItem**](MenuItem.md)

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

