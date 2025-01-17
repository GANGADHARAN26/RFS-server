# RFS-server
Project Documentation

Features Implemented

1. User Authentication

Login Functionality:

Users can log in using their email and password.

Authentication is handled using JWT tokens.

Tokens are stored in cookies for secure access.

Forgot Password:

Users can request a password reset link via email.

OTP-based password reset is implemented.

Change Password:

Users can update their password after validating OTP and providing a new password.

2. Candidate Management Dashboard

Features:

Add Candidate:

Form to add a candidate with fields such as name, job title, email, phone number, and resume (PDF).

Validates uploaded resume files (must be PDF and less than 2 MB).

View Candidates:

List of all candidates with details like name, job title, email, phone, state, and resume link.

Displays resume URLs for preview.

Edit Candidate:

Edit candidate details, including job title and status.

Update the resume file if needed.

Delete Candidate:

Remove a candidate from the database.

Filters and Sorting:

Filter candidates by job title or state.

Sort candidates by name in ascending or descending order.

Search:

Search candidates by name.

3. Backend Services

Email Service:

Implemented using Nodemailer to send emails for password reset and other notifications.

Middleware for Authentication:

Custom middleware to validate JWT tokens and authorize access to protected routes.

Logging:

Integrated logging with a custom logger for error and activity tracking.

S3 File Uploads:

Resumes are uploaded to Amazon S3 using the AWS SDK.

Ensures secure and scalable storage for candidate files.

JWT Token Management:

Secure generation of JWT tokens for user authentication.

Token expiration and validation handled.

Input Validation:

Used Joi for robust input validation on all backend APIs.

Error Handling:

Centralized error handling middleware with detailed logs for better debugging and monitoring.

4. Token Expiry Handling

Intercepts API responses to handle 401 Unauthorized errors due to token expiration.

Automatically clears cookies and local storage, then redirects users to the login page.

5. Notifications

Toast notifications for success and error messages:

Successful login, candidate creation, update, and deletion.

Token expiration or API errors are displayed as error notifications.

6. State Management with Redux and Redux Toolkit

Centralized State Management:

All application states, including authentication, candidates, and notifications, are managed using Redux Toolkit.

Async Thunks:

Asynchronous operations like fetching, creating, updating, and deleting candidates are handled using Redux Toolkit's createAsyncThunk.

Error Handling:

Built-in error handling with state updates and toast notifications.

Performance Optimizations:

Efficient state updates with immutability ensured by Redux Toolkit.

7. Input Validations

Backend Validations:

All inputs are validated server-side using Joi, ensuring data integrity.

Frontend Validations:

Validations for forms include required fields, email format checks, file size and type checks for resumes, and more.

# API Documentation

## Authentication Endpoints

### Register User
**Endpoint:** `/api/auth/register`

**Method:** POST

**Description:** Registers a new user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string",
  "username": "string",
  "role": "string"
}
```

**Response:**
- Success: HTTP 201
```json
{
  "success": true,
  "message": "User has been created",
  "accessToken": "string",
  "refreshToken": "string"
}
```
- Failure: HTTP 400 or 500

---

### Login User
**Endpoint:** `/api/auth/login`

**Method:** POST

**Description:** Logs in an existing user.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
- Success: HTTP 200
```json
{
  "success": true,
  "message": "User logged in successfully",
  "accessToken": "string",
  "refreshToken": "string"
}
```
- Failure: HTTP 404 or 401

---

### Request Password Reset
**Endpoint:** `/api/auth/forgot-password`

**Method:** POST

**Description:** Sends an OTP to the user's email for password reset.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
- Success: HTTP 200
```json
{
  "success": true,
  "message": "OTP sent to email"
}
```
- Failure: HTTP 404 or 500

---

### Reset Password
**Endpoint:** `/api/auth/reset-password`

**Method:** POST

**Description:** Resets the user's password.

**Request Body:**
```json
{
  "email": "string",
  "otp": "string",
  "newPassword": "string"
}
```

**Response:**
- Success: HTTP 200
```json
{
  "success": true,
  "message": "Password reset successful"
}
```
- Failure: HTTP 400 or 500

---

## Candidate Endpoints

### Create Candidate
**Endpoint:** `/api/candidates`

**Method:** POST

**Description:** Creates a new candidate. Requires HR or ADMIN role.

**Request Body:**
```json
{
  "name": "string",
  "jobTitle": "string",
  "email": "string",
  "phoneNumber": "string",
  "state": "string" (optional),
  "resume": "file"
}
```

**Response:**
- Success: HTTP 201
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "jobTitle": "string",
    "email": "string",
    "phoneNumber": "string",
    "resumeUrl": "string",
    "addedBy": "string"
  }
}
```
- Failure: HTTP 400 or 500

---

### Get All Candidates
**Endpoint:** `/api/candidates`

**Method:** GET

**Description:** Fetches all candidates added by the authenticated user.

**Response:**
- Success: HTTP 200
```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "name": "string",
      "jobTitle": "string",
      "email": "string",
      "phoneNumber": "string",
      "resumeUrl": "string",
      "addedBy": "string"
    }
  ]
}
```
- Failure: HTTP 500

---

### Update Candidate
**Endpoint:** `/api/candidates/:id`

**Method:** PUT

**Description:** Updates a candidate's information. Requires HR or ADMIN role.

**Request Body:**
```json
{
  "name": "string",
  "jobTitle": "string",
  "email": "string",
  "phoneNumber": "string",
  "state": "string",
  "resume": "file" (optional)
}
```

**Response:**
- Success: HTTP 200
```json
{
  "success": true,
  "data": {
    "_id": "string",
    "name": "string",
    "jobTitle": "string",
    "email": "string",
    "phoneNumber": "string",
    "resumeUrl": "string",
    "addedBy": "string"
  }
}
```
- Failure: HTTP 400 or 500

---

### Delete Candidate
**Endpoint:** `/api/candidates/:id`

**Method:** DELETE

**Description:** Deletes a candidate's record. Requires HR or ADMIN role.

**Response:**
- Success: HTTP 200
```json
{
  "success": true,
  "message": "Candidate deleted successfully"
}
```
- Failure: HTTP 404 or 500

