# Punetori API

## Searching Jobs

<p>The URL</p>

<strong>GET</strong> <http://localhost:5000/search/:query>

#### Response

```javascript
{
  "success": true,
  "query": "xxxxxxx",
  "count": 26,
  "data": [
    {
      "title": "xxxxxx",
      "link": "https://www.njoftimefalas.com/23/oferta-njoftime-pune/id-xxxxxxxx"
    },...
  ]
}
```

## Register User

<p>The URL</p>

<strong>POST</strong> <http://localhost:5000/auth/register>

### Input Headers

```javascript
{
   "Content-Type": "application/json"
}
```

### Input

```javascript
{
    "name":"user",
    "email":"example@example.com",
    "password":"12345678",
    "jobTitle":"xxxxxxx"
}
```

#### Response

```javascript
{
    "success": true,
    "token": "token"
}
```

## Login User

<p>The URL</p>

<strong>POST</strong> <http://localhost:5000/auth/login>

### Input Headers

```javascript
{
   "Content-Type": "application/json"
}
```

### Input

```javascript
{
    "email":"example@example.com",
    "password":"12345678"
}
```

#### Response

```javascript
{
    "success": true,
    "token": "token"
}
```

## Delete User

<p>The URL</p>

<strong>DELETE</strong> <http://localhost:5000/auth/remove>

### Input Headers

```javascript
{
   "Authorization": "Bearer token"
}
```

#### Response

```javascript
{
    "success": true,
    "message": "Your account was deleted successfullys"
}
```

## Get User Detail

<p>The URL</p>

<strong>GET</strong> <http://localhost:5000/auth/me>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
    "Authorization": "Bearer token"
}
```

#### Response

```javascript
{
    "success": true,
    "user": {
        "sendEmail": true,
        "_id": "xxx",
        "name": "user",
        "email": "example@example.com",
        "jobTitle": "xxxxx",
        "createdAt": "xxxx",
    }
}
```

## Update User Detail

<p>The URL</p>

<strong>PUT</strong> <http://localhost:5000/auth/update>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
    "Authorization": "Bearer token"
}
```

#### Input

```javascript
{
    "name":"user",
    "email":"user@example.com",
    "jobTitle":"xxxxxxxxx"
}
```

## Update User Password

<p>The URL</p>

<strong>PUT</strong> <http://localhost:5000/auth/update>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
    "Authorization": "Bearer token"
}
```

#### Input

```javascript
{
    "currentPassword":"12345678",
    "newPassword":"12345678s"
}
```

## Get User Jobs

<p>The URL</p>

<strong>GET</strong> <http://localhost:5000/auth/jobs>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
    "Authorization": "Bearer token"
}
```

#### Response

```javascript
{
    "success": true,
    "query": "xxxxxxx",
    "data": [
        {
        "title": "xxxxxxxx",
        "link": "https://www.njoftimefalas.com/23/oferta-njoftime-pune/id-xxxx"
        },...
    ]
}
```

## Bookmark Job

<p>The URL</p>

<strong>POST</strong> <http://localhost:5000/auth/bookmark>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
    "Authorization": "Bearer token"
}
```

### Input

```javascript
{
    "title": "xxxxxx",
    "link": "https://www.njoftimefalas.com/23/oferta-njoftime-pune/id-xxxxx"
}
```

#### Response

```javascript
{
    "success": true,
    "message": "Job bookmarked"
}
```

## Get Bookmark

<p>The URL</p>

<strong>GET</strong> <http://localhost:5000/auth/bookmark>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
    "Authorization": "Bearer token"
}
```

## Check if Job is Bookmarked

<p>The URL</p>

<strong>POST</strong> <http://localhost:5000/auth/bookmark/check>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
    "Authorization": "Bearer token"
}
```

### Input

```javascript
{
    "link":"Job Link"
}
```

## Forgot Password

<p>The URL</p>

<strong>POST</strong> <http://localhost:5000/auth/forgotpassword>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
}
```

### Input

```javascript
{
    "email":"user@example.com"
}
```

## Reset Password

<p>The URL</p>

<strong>PUT</strong> <http://localhost:5000/auth/resetpassword/:resetToken>

### Input Headers

```javascript
{
    "Content-Type": "application/json"
}
```

### Input

```javascript
{
    "password":"123456789"
}
```
