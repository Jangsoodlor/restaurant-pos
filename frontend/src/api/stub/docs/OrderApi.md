# OrderApi

All URIs are relative to *http://localhost*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**createOrderOrderPost**](OrderApi.md#createorderorderpost) | **POST** /order/ | Create Order |
| [**deleteOrderOrderOrderIdDelete**](OrderApi.md#deleteorderorderorderiddelete) | **DELETE** /order/{order_id} | Delete Order |
| [**listOrdersOrderGet**](OrderApi.md#listordersorderget) | **GET** /order/ | List Orders |
| [**partialUpdateOrderOrderOrderIdPatch**](OrderApi.md#partialupdateorderorderorderidpatch) | **PATCH** /order/{order_id} | Partial Update Order |
| [**retrieveOrderOrderOrderIdGet**](OrderApi.md#retrieveorderorderorderidget) | **GET** /order/{order_id} | Retrieve Order |



## createOrderOrderPost

> Order createOrderOrderPost(bodyCreateOrderOrderPost)

Create Order

Create a new order.

### Example

```ts
import {
  Configuration,
  OrderApi,
} from '';
import type { CreateOrderOrderPostRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new OrderApi(config);

  const body = {
    // BodyCreateOrderOrderPost
    bodyCreateOrderOrderPost: ...,
  } satisfies CreateOrderOrderPostRequest;

  try {
    const data = await api.createOrderOrderPost(body);
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
| **bodyCreateOrderOrderPost** | [BodyCreateOrderOrderPost](BodyCreateOrderOrderPost.md) |  | |

### Return type

[**Order**](Order.md)

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


## deleteOrderOrderOrderIdDelete

> deleteOrderOrderOrderIdDelete(orderId)

Delete Order

Delete an order by ID.

### Example

```ts
import {
  Configuration,
  OrderApi,
} from '';
import type { DeleteOrderOrderOrderIdDeleteRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new OrderApi(config);

  const body = {
    // number
    orderId: 56,
  } satisfies DeleteOrderOrderOrderIdDeleteRequest;

  try {
    const data = await api.deleteOrderOrderOrderIdDelete(body);
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
| **orderId** | `number` |  | [Defaults to `undefined`] |

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


## listOrdersOrderGet

> Array&lt;OrderWithLineItems&gt; listOrdersOrderGet(offset, limit, status, tableId, userId)

List Orders

### Example

```ts
import {
  Configuration,
  OrderApi,
} from '';
import type { ListOrdersOrderGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new OrderApi(config);

  const body = {
    // number (optional)
    offset: 56,
    // number (optional)
    limit: 56,
    // OrderStatus (optional)
    status: ...,
    // number (optional)
    tableId: 56,
    // number (optional)
    userId: 56,
  } satisfies ListOrdersOrderGetRequest;

  try {
    const data = await api.listOrdersOrderGet(body);
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
| **status** | `OrderStatus` |  | [Optional] [Defaults to `undefined`] [Enum: draft, in_progress, awaiting_payment, on_hold, completed, cancelled, voided, refunded] |
| **tableId** | `number` |  | [Optional] [Defaults to `undefined`] |
| **userId** | `number` |  | [Optional] [Defaults to `undefined`] |

### Return type

[**Array&lt;OrderWithLineItems&gt;**](OrderWithLineItems.md)

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


## partialUpdateOrderOrderOrderIdPatch

> Order partialUpdateOrderOrderOrderIdPatch(orderId, orderUpdate)

Partial Update Order

Partially update an order (only provided fields).

### Example

```ts
import {
  Configuration,
  OrderApi,
} from '';
import type { PartialUpdateOrderOrderOrderIdPatchRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new OrderApi(config);

  const body = {
    // number
    orderId: 56,
    // OrderUpdate
    orderUpdate: ...,
  } satisfies PartialUpdateOrderOrderOrderIdPatchRequest;

  try {
    const data = await api.partialUpdateOrderOrderOrderIdPatch(body);
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
| **orderId** | `number` |  | [Defaults to `undefined`] |
| **orderUpdate** | [OrderUpdate](OrderUpdate.md) |  | |

### Return type

[**Order**](Order.md)

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


## retrieveOrderOrderOrderIdGet

> Order retrieveOrderOrderOrderIdGet(orderId)

Retrieve Order

Get a single order by ID.

### Example

```ts
import {
  Configuration,
  OrderApi,
} from '';
import type { RetrieveOrderOrderOrderIdGetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // To configure OAuth2 access token for authorization: OAuth2PasswordBearer password
    accessToken: "YOUR ACCESS TOKEN",
  });
  const api = new OrderApi(config);

  const body = {
    // number
    orderId: 56,
  } satisfies RetrieveOrderOrderOrderIdGetRequest;

  try {
    const data = await api.retrieveOrderOrderOrderIdGet(body);
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
| **orderId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Order**](Order.md)

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

