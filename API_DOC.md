# API Documentation

This document provides a comprehensive reference for the MRC Club Admin API.

## Base URL
All API endpoints are prefixed with `/api`.

## Authentication

### Login
Authenticate an admin user.
- **Endpoint**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  - `200 OK`: `{ "success": true, "user": { ... } }` (Set `admin_session` cookie)
  - `401 Unauthorized`: Invalid credentials

### Logout
 invalidate the current session.
- **Endpoint**: `POST /api/auth/logout`
- **Response**:
  - `200 OK`: `{ "success": true }`

---

## Public Endpoints

### Register Member
Submit a new member registration.
- **Endpoint**: `POST /api/register`
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `namaLengkap`, `email`, `nomorTelephone`, `password`
  - `tipeMobile`, `tahunKendaraan`, `warnaKendaraan`, `nomorPolisi`
  - `ktp`, `stnk`, `fotoKendaraanDepan`, `fotoKendaraanBelakang`, `fotoKendaraanSamping`, `buktiTransfer` (Files)
- **Response**:
  - `201 Created`: Registration successful
  - `409 Conflict`: Email or License Plate already exists

### Contact Form
Submit a public contact query.
- **Endpoint**: `POST /api/contact`
- **Body**:
  ```json
  {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "message": "Hello..."
  }
  ```

### Public Events
Get list of upcoming events.
- **Endpoint**: `GET /api/events`
- **Response**: `200 OK` Array of events.

---

## Admin - Data Management

### List Members
Fetch members with filtering options.
- **Endpoint**: `GET /api/admin/members`
- **Query Params**:
  - `status`: `all` | `pending` | `approved` | `rejected`
  - `search`: Search by name, email, or license plate
  - `startDate`, `endDate`: Filter by registration date
- **Response**: `200 OK` `{ "data": [...] }`

### Update Member Status
Approve, reject, delete, or restore a member.
- **Endpoint**: `PATCH /api/admin/members`
- **Body**:
  ```json
  {
    "memberId": "uuid",
    "status": "approved" | "rejected",
    "action": "delete" | "restore" // Optional
  }
  ```

### Dashboard Stats
Get aggregate statistics.
- **Endpoint**: `GET /api/admin/stats`

---

## CMS (Content Management)

Protected endpoints for managing website content.

### Gallery
- **GET /api/cms/gallery**: List images (ordered).
- **POST /api/cms/gallery**: Add image.
  - Body: `{ "title": "...", "image_url": "..." }`
- **PUT /api/cms/gallery**: Update image details/order.
- **DELETE /api/cms/gallery?id=...**: Remove image.

### Events (CMS)
- **GET /api/cms/events**: List all events (including drafted/hidden if applicable).
- **POST /api/cms/events**: Create event.
- **PUT /api/cms/events**: Update event.
  - Body: `{ "id": "...", ...fields }`
- **DELETE /api/cms/events?id=...**: Delete event.

### Benefits
- **GET /POST / PUT / DELETE /api/cms/benefits**: CRUD operations for membership benefits section.

### Section Configurations
Endpoints to Get (GET) or Update (PUT) specific page sections.
- **/api/cms/hero**: Hero section (Title, Description, Background).
- **/api/cms/about**: About Us section.
- **/api/cms/contact**: Contact page configuration (Phone, Email, Address in UI).
- **/api/cms/footer**: Footer settings.
- **/api/cms/membership**: Membership info section.
- **/api/cms/social-media**: Social media links.
- **/api/cms/logo**: Site logo configuration.

---

## Utilities

### File Upload
General purpose file upload (e.g., for CMS images).
- **Endpoint**: `POST /api/upload`
- **Body**: `FormData` with `file`.
- **Response**: `{ "url": "/uploads/filename.jpg" }`

### Health Check
- **Endpoint**: `GET /api/health`
- **Response**: `{ "status": "ok", ... }`
