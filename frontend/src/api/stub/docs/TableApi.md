# TableApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createTableTablePost**](TableApi.md#createtabletablepost) | **POST** /table/ | Create Table |
| [**deleteTableTableTableIdDelete**](TableApi.md#deletetabletabletableiddelete) | **DELETE** /table/{table_id} | Delete Table |
| [**listTablesTableGet**](TableApi.md#listtablestableget) | **GET** /table/ | List Tables |
| [**partialUpdateTableTableTableIdPatch**](TableApi.md#partialupdatetabletabletableidpatch) | **PATCH** /table/{table_id} | Partial Update Table |
| [**retrieveTableTableTableIdGet**](TableApi.md#retrievetabletabletableidget) | **GET** /table/{table_id} | Retrieve Table |



## createTableTablePost

> Table createTableTablePost(tableBase)

Create Table

Create a new table.

### Example

```ts
import {
  Configuration,
  TableApi,
} from '';
import type { CreateTableTablePostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new TableApi(config);

  const body = {
    // TableBase
    tableBase: ...,
  } satisfies CreateTableTablePostRequest;

  try {
    const data = await api.createTableTablePost(body);
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
| **tableBase** | [TableBase](TableBase.md) |  | |

### Return type

[**Table**](Table.md)

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


## deleteTableTableTableIdDelete

> deleteTableTableTableIdDelete(tableId)

Delete Table

Delete a table by ID.

### Example

```ts
import {
  Configuration,
  TableApi,
} from '';
import type { DeleteTableTableTableIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new TableApi(config);

  const body = {
    // number
    tableId: 56,
  } satisfies DeleteTableTableTableIdDeleteRequest;

  try {
    const data = await api.deleteTableTableTableIdDelete(body);
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
| **tableId** | `number` |  | [Defaults to `undefined`] |

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


## listTablesTableGet

> Array&lt;Table&gt; listTablesTableGet(offset, limit)

List Tables

Get all tables with pagination.

### Example

```ts
import {
  Configuration,
  TableApi,
} from '';
import type { ListTablesTableGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new TableApi(config);

  const body = {
    // number (optional)
    offset: 56,
    // number (optional)
    limit: 56,
  } satisfies ListTablesTableGetRequest;

  try {
    const data = await api.listTablesTableGet(body);
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

### Return type

[**Array&lt;Table&gt;**](Table.md)

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


## partialUpdateTableTableTableIdPatch

> Table partialUpdateTableTableTableIdPatch(tableId, tableUpdate)

Partial Update Table

Partially update a table (only provided fields).

### Example

```ts
import {
  Configuration,
  TableApi,
} from '';
import type { PartialUpdateTableTableTableIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new TableApi(config);

  const body = {
    // number
    tableId: 56,
    // TableUpdate
    tableUpdate: ...,
  } satisfies PartialUpdateTableTableTableIdPatchRequest;

  try {
    const data = await api.partialUpdateTableTableTableIdPatch(body);
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
| **tableId** | `number` |  | [Defaults to `undefined`] |
| **tableUpdate** | [TableUpdate](TableUpdate.md) |  | |

### Return type

[**Table**](Table.md)

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


## retrieveTableTableTableIdGet

> Table retrieveTableTableTableIdGet(tableId)

Retrieve Table

Get a single table by ID.

### Example

```ts
import {
  Configuration,
  TableApi,
} from '';
import type { RetrieveTableTableTableIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new TableApi(config);

  const body = {
    // number
    tableId: 56,
  } satisfies RetrieveTableTableTableIdGetRequest;

  try {
    const data = await api.retrieveTableTableTableIdGet(body);
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
| **tableId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Table**](Table.md)

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

