# Week 02 API Specification

## Project Overview
This specification defines a Node.js/Express API for managing a Books and Authors library system. The API uses MongoDB as the data persistence layer and follows RESTful conventions for CRUD operations. It is designed to support two collections:

- `books`
- `authors`

The API must validate required fields, enforce unique IDs, maintain author references, and protect author deletion when books still reference them.

---

## 1. Feature 1: Book CRUD Operations and Author References

### 1.1 Purpose
The Books feature supports managing books with a required `authorId` reference to an existing author. This ensures data integrity and prevents orphaned records.

### 1.2 Book Data Model
Collection name: `books`

Required fields:
- `id` (string, required, unique)
- `authorId` (string, required)
- `title` (string, required)
- `publicationDate` (string, required)

Example document:
```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "The Hobbit",
  "publicationDate": "1937-09-21"
}
```

### 1.3 Book Validation Rules
When creating or updating a book, the API must validate the following:

- `id` is required and must be a non-empty string
- `authorId` is required and must be a non-empty string
- `title` is required and must be a non-empty string
- `publicationDate` is required and must be a non-empty string
- `id` must be unique across the `books` collection
- `authorId` must exist in the `authors` collection
- If `id` duplicates an existing book, return `400 Bad Request`
- If required fields are missing, return `400 Bad Request`
- If `authorId` does not match an existing author, return `400 Bad Request`

### 1.4 Relationship Rule
A book cannot be created or updated with an `authorId` that does not correspond to a valid author in the `authors` collection.

Example invalid request:
```json
{
  "id": "b2",
  "authorId": "missing-author",
  "title": "A Book",
  "publicationDate": "2024-01-01"
}
```

Expected response:
```json
{
  "message": "Invalid authorId: author does not exist"
}
```

HTTP status:
- `400 Bad Request`

### 1.5 Book Routes

#### GET /books
Returns all books.

Response:
- `200 OK`
- JSON array of books

Example response:
```json
[
  {
    "id": "b1",
    "authorId": "a1",
    "title": "The Hobbit",
    "publicationDate": "1937-09-21"
  }
]
```

#### GET /books/:id
Returns a single book by its book `id`.

Behavior:
- If the book is found: `200 OK`
- If not found: `404 Not Found`

Example response when missing:
```json
{
  "message": "Book not found"
}
```

#### POST /books
Creates a new book.

Request body:
```json
{
  "id": "b2",
  "authorId": "a1",
  "title": "The Lord of the Rings",
  "publicationDate": "1954-07-29"
}
```

Behavior:
- If valid: `201 Created`
- If required fields are missing: `400 Bad Request`
- If duplicate `id`: `400 Bad Request`
- If `authorId` does not exist: `400 Bad Request`

Example success response:
```json
{
  "id": "b2",
  "authorId": "a1",
  "title": "The Lord of the Rings",
  "publicationDate": "1954-07-29"
}
```

#### PUT /books/:id
Updates an existing book.

Behavior:
- If the book exists and update is valid: `200 OK`
- If the book does not exist: `404 Not Found`
- If required fields are invalid or `authorId` is missing/not found: `400 Bad Request`
- If duplicate `id` is attempted in a way that conflicts with another book: `400 Bad Request`

Example request body:
```json
{
  "authorId": "a1",
  "title": "The Lord of the Rings: Revised Edition",
  "publicationDate": "1954-07-29"
}
```

#### DELETE /books/:id
Deletes a single book by its `id`.

Behavior:
- If the book exists: `204 No Content`
- If no book is found: `404 Not Found`

Response for successful delete:
- Empty body
- `204 No Content`

### 1.6 Swagger Documentation Expectations
The API should expose Swagger/OpenAPI documentation for all book endpoints.

Required entries in Swagger:
- `GET /books`
- `GET /books/{id}`
- `POST /books`
- `PUT /books/{id}`
- `DELETE /books/{id}`

Each endpoint should document:
- path parameters
- request body schema
- required properties
- validation notes for `authorId` and duplicate/required field handling
- expected HTTP responses (`200`, `201`, `204`, `400`, `404`)

### 1.7 Render Deployment Expectations
This API is expected to be deployable on Render using:

- a Node.js web service
- environment variables for database connection, such as `MONGODB_URI`
- a production `PORT` value supplied by Render
- a `start` script configured in `package.json`

Recommended Render configuration:
- Build command: `npm install`
- Start command: `npm start`
- Environment variables:
  - `MONGODB_URI`
  - `PORT`

The application should run without requiring a local-only process or a developer machine dependency beyond the configured environment variables.

---

## 2. Feature 2: Author CRUD Operations

### 2.1 Purpose
The Authors feature supports managing authors separately from books while enforcing author integrity. Authors are stored in an `authors` collection and book records reference them via `authorId`.

### 2.2 Author Data Model
Collection name: `authors`

Required fields:
- `id` (string, required, unique)
- `name` (string, required)
- `birthYear` (number, required)

Example document:
```json
{
  "id": "a1",
  "name": "J.R.R. Tolkien",
  "birthYear": 1892
}
```

### 2.3 Author Validation Rules
When creating or updating an author, the API must validate:

- `id` is required and must be a non-empty string
- `name` is required and must be a non-empty string
- `birthYear` is required and must be a valid number
- `id` must be unique across the `authors` collection
- Duplicate author `id` values are rejected with `400 Bad Request`
- Missing required fields are rejected with `400 Bad Request`

### 2.4 Relationship Protection Rule
Deleting an author must be blocked if any book still references that author via `authorId`.

This prevents breaking data integrity and orphaned references.

Example:
- Author `a1` exists
- One or more books have `authorId: "a1"`
- Delete request for `a1` is attempted

Expected outcome:
- `409 Conflict` (preferred) or `400 Bad Request`
- Response message such as:
```json
{
  "message": "Cannot delete author: books still reference this author"
}
```

### 2.5 Author Routes

#### GET /authors
Returns all authors.

Response:
- `200 OK`
- JSON array of authors

Example response:
```json
[
  {
    "id": "a1",
    "name": "J.R.R. Tolkien",
    "birthYear": 1892
  }
]
```

#### GET /authors/:id
Returns a single author by `id`.

Behavior:
- If found: `200 OK`
- If missing: `404 Not Found`

Example response when missing:
```json
{
  "message": "Author not found"
}
```

#### POST /authors
Creates a new author.

Request body:
```json
{
  "id": "a2",
  "name": "George Orwell",
  "birthYear": 1903
}
```

Behavior:
- If valid: `201 Created`
- If required fields are missing: `400 Bad Request`
- If duplicate `id`: `400 Bad Request`

Example success response:
```json
{
  "id": "a2",
  "name": "George Orwell",
  "birthYear": 1903
}
```

#### PUT /authors/:id
Updates an existing author.

Behavior:
- If found and valid: `200 OK`
- If not found: `404 Not Found`
- If required field validation fails: `400 Bad Request`
- If duplicate `id` is supplied in a conflicting form: `400 Bad Request`

Example request body:
```json
{
  "name": "George Orwell",
  "birthYear": 1903
}
```

#### DELETE /authors/:id
Deletes a single author by `id`.

Behavior:
- If the author exists and no books reference them: `204 No Content`
- If the author does not exist: `404 Not Found`
- If the author has active books linked by `authorId`: `409 Conflict` (or `400 Bad Request`)

### 2.6 Swagger Documentation Expectations
The API should expose Swagger/OpenAPI documentation for all author endpoints.

Required entries in Swagger:
- `GET /authors`
- `GET /authors/{id}`
- `POST /authors`
- `PUT /authors/{id}`
- `DELETE /authors/{id}`

Each endpoint should document:
- required fields
- request and response schemas
- duplicate ID handling
- missing author behavior
- dependency protection when deleting authors with existing books
- expected responses (`200`, `201`, `204`, `400`, `404`, `409`)

---

## Shared API Requirements

### Validation Standards
The API should consistently validate all incoming payloads and reject invalid requests with clear JSON error messages.

Common patterns:
```json
{
  "message": "Missing required field: id"
}
```

or
```json
{
  "message": "Duplicate id: b1"
}
```

### Error Handling Standards
Common status codes:
- `200 OK` — successful read or update
- `201 Created` — successful creation
- `204 No Content` — successful deletion
- `400 Bad Request` — invalid input, missing required fields, bad IDs, duplicate IDs, invalid references
- `404 Not Found` — resource not found
- `409 Conflict` — deleting an author with active books still referencing them
- `500 Internal Server Error` — unexpected server-side issue

### MongoDB Storage Model Recommendations
Projects using MongoDB should store documents as follows:

Books collection example:
```json
{
  "id": "b1",
  "authorId": "a1",
  "title": "The Hobbit",
  "publicationDate": "1937-09-21"
}
```

Authors collection example:
```json
{
  "id": "a1",
  "name": "J.R.R. Tolkien",
  "birthYear": 1892
}
```

This design keeps each resource separate but enables easy validation of referential integrity.

---

## Example Full Book Request
```json
{
  "id": "b3",
  "authorId": "a1",
  "title": "The Silmarillion",
  "publicationDate": "1977-09-15"
}
```

## Example Full Author Request
```json
{
  "id": "a3",
  "name": "C.S. Lewis",
  "birthYear": 1898
}
```

---

## Summary
This assignment introduces a clean REST API structure for:

1. book management with author reference validation
2. author management with relationship protection
3. consistent Swagger API documentation
4. deployment-readiness for Render

The implementation should enforce both data validation and referential integrity to ensure the API behaves predictably and safely in production.
