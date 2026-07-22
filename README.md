# CarHub - Car Dealership Inventory System

CarHub is a complete full-stack Car Dealership Inventory System built with an Express/Node.js API backend, MongoDB persistence, and a React + Vite + Tailwind CSS frontend.

## Features
- **Authentication**: JWT token-based authentication with role-based permissions (`USER` and `ADMIN`).
- **Vehicle Inventory**: CRUD operations on vehicles (admin only) and vehicle purchase operations (decreasing quantity atomically).
- **Search & Filters**: Dynamically search and filter vehicles by make, model, category, and price range.
- **Light Theme UI**: Responsive, professional, and accessible light theme frontend client.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB instance running locally or hosted online

### Environment Variables
Configure your `.env` file at the root:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/car_dealership
JWT_SECRET=supersecretjwtkey123
```

### Installation

1. Install backend dependencies at the root:
   ```bash
   npm install
   ```

2. Install frontend dependencies inside `/frontend`:
   ```bash
   cd frontend
   npm install
   ```

### Running the App

1. Run backend server:
   ```bash
   npm start
   ```

2. Run frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

3. Run test suite:
   ```bash
   npm test
   ```
