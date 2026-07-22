# Car Dealership Inventory System

A full-stack Car Dealership Inventory System built with Node.js, Express.js, MongoDB, and React. The application allows users to browse vehicles and enables administrators to manage inventory through a secure dashboard.

---

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Jest
- Supertest

### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

---

## Features

### Authentication

- User registration
- User login
- JWT-based authentication
- Role-based authorization
- Protected routes
- Admin-only routes

### Vehicle Management

- Create vehicle
- View all vehicles
- Search and filter vehicles
- Update vehicle details
- Delete vehicles
- Purchase vehicles
- Restock inventory

### Search Filters

Users can search vehicles by:

- Make
- Model
- Category
- Minimum price
- Maximum price

---

## Project Structure

### Backend

```text
backend/

src/

├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── tests/
├── validators/
├── utils/
├── app.js
└── server.js
```

### Frontend

```text
frontend/

src/

├── api/
├── components/
├── context/
├── hooks/
├── pages/
├── routes/
└── main.jsx
```

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

---

### Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Run the backend server:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/register

POST /api/auth/login
```

---

### Vehicles

```http
POST   /api/vehicles

GET    /api/vehicles

GET    /api/vehicles/search

PUT    /api/vehicles/:id

DELETE /api/vehicles/:id
```

---

### Inventory

```http
POST /api/vehicles/:id/purchase

POST /api/vehicles/:id/restock
```

---

## Running Tests

Run all tests:

```bash
npm test
```

---

## Admin Access

By default, newly registered users receive the role:

```text
user
```

To access admin features:

1. Register a new account.
2. Open MongoDB Compass.
3. Update the user's role:

```json
{
  "role": "admin"
}
```

4. Log in again.

---

## Test-Driven Development

This project follows the Red-Green-Refactor cycle:

1. Write failing tests.
2. Implement the feature.
3. Refactor the code.

Testing tools:

- Jest
- Supertest

---

## AI Usage

AI assistance was used during development.

Tools used:

- Antigravity

AI was used for:

- Project setup
- Folder structure suggestions
- API design
- Test case generation
- Refactoring suggestions
- Frontend scaffolding
- Documentation

All generated code was manually reviewed, tested, and modified before being committed.

The complete prompt history is available in:

```text
PROMPTS.md
```

---

## Future Improvements

- Pagination
- Image uploads
- Sorting
- Docker support
- CI/CD pipeline
- Deployment

---

## Author

Sanket Patoliya
