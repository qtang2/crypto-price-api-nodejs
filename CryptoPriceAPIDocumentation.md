# Cryptocurrency Price API

The Cryptocurrency Price API allows users to query the current price($) of a specific cryptocurrency and receive an email with the result. It also provides an endpoint to retrieve the search history.

## Base URL
https://g01r9x4fag.execute-api.ap-southeast-2.amazonaws.com/Prod

## Endpoints

### 1. Get Cryptocurrency Price

**Endpoint:**
GET /crypto-price
**Description:**
Queries the current price of a specified cryptocurrency and sends an email with the result.
**Query Parameters:**

| Parameter | Type   | Required | Description                          |
|-----------|--------|----------|--------------------------------------|
| crypto    | string | Yes      | The ID of the cryptocurrency to query (e.g., bitcoin). |
| email     | string | Yes      | The email address to send the price information to.              |

**Request Example:**
GET /crypto-price?crypto=ethereum&email=qiantest2024@gmail.com
**Response Example:**
```json
{
  "message": "The current price of ethereum is $2000. An email has been sent to qiantest2024@gmail.com."
}
```
Error Response Example:
```json
{
  "error": "Invalid cryptocurrency ID or email address."
}
```

### 2. Get Search History

**Endpoint:**
GET /search-history
**Description:**
Retrieves all the search history, including when and what cryptocurrency was queried.
**Request Example:**
GET https://g01r9x4fag.execute-api.ap-southeast-2.amazonaws.com/Prod/search-history
**Response Example:**
```json
[
  {
    "searchId": "1a2b3c4d-5678-90ab-cdef-1234567890ab",
    "crypto": "bitcoin",
    "timestamp": "2024-06-20T14:22:26.178Z",
    "email": "example@example.com"
  },
  {
    "searchId": "2b3c4d5e-6789-01bc-defg-2345678901bc",
    "crypto": "ethereum",
    "timestamp": "2024-06-20T14:23:26.178Z",
    "email": "another@example.com"
  }
]
```

> [!NOTE]  
> Due to the restriction of aws SES service( current SES account is in the sandbox environment), only verified email can be used for the receivers. Example test email is qiantest2024@gmail.com, password: test2024test 
> Ensure that both the crypto and email parameters are correctly provided when querying the cryptocurrency price.
