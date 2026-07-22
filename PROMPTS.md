# PROMPTS.md

## Prompt 1 — Initialize Backend

Initialize the backend for a Car Dealership Inventory System using:

- Node.js
- Express.js
- MongoDB with Mongoose
- Jest
- Supertest

Set up the project dependencies and dev dependencies only. Do not write business logic.

Use clean folder organization and explain why each dependency is needed.

Do not generate frontend code.

---

## Prompt 2 — Backend Structure

Design a scalable folder structure for an Express.js application following separation of concerns.

The project is a Car Dealership Inventory System with:

- Authentication
- Vehicle CRUD
- Inventory management
- Testing

Create folders for:

- config
- controllers
- middleware
- models
- routes
- services
- tests
- validators
- utils

Explain the purpose of each folder.

---

## Prompt 3 — Configure NPM

Configure package.json scripts for:

- Development with nodemon
- Production
- Testing with Jest

Use ES modules.

Generate only the required scripts and configuration.

---

## Prompt 4 — Express Setup

Create the initial Express application.

Requirements:

- Configure express.json()
- Create app.js and server.js
- Load environment variables using dotenv
- Add a GET /api/health endpoint

Keep the implementation minimal and production-ready.

Do not add authentication or database code yet.

---

## Prompt 5 — Health Endpoint Tests

Write an integration test using Jest and Supertest for:

GET /api/health

Requirements:

- Follow the Red-Green-Refactor cycle
- Verify status code 200
- Verify response body

Use modern Jest syntax and keep the test maintainable.

---

## Prompt 6 — Configure Jest

Configure Jest for an Express.js project using ES modules.

Requirements:

- Node environment
- Compatibility with import/export syntax
- Keep configuration minimal

Generate only the necessary configuration file.

---

## Prompt 7 — MongoDB Configuration

Create a reusable MongoDB connection setup using Mongoose.

Requirements:

- Create src/config/db.js
- Read the MongoDB URI from environment variables
- Export a connectDB function
- Handle connection success and failure

Do not connect the database automatically.

---

## Prompt 8 — Connect Database

Update server.js to connect to MongoDB before starting the Express server.

Requirements:

- Use connectDB
- Load environment variables
- Start the server only after a successful connection
- Handle startup errors gracefully

---

## Prompt 9 — Environment Setup

Generate the required environment files.

Requirements:

- Create .env.example
- Add PORT
- Add MONGODB_URI
- Add JWT_SECRET
- Update .gitignore

---

## Prompt 10 — Registration Tests

Write integration tests using Jest and Supertest for:

POST /api/auth/register

Test cases:

- Register a user successfully
- Reject duplicate email addresses
- Reject requests with missing required fields

Do not implement the endpoint yet.

---

## Prompt 11 — User Model

Create a Mongoose User model.

Requirements:

- name
- email (unique)
- password
- role

The role should support:

- user
- admin

Add timestamps.

---

## Prompt 12 — Registration Endpoint

Implement POST /api/auth/register.

Requirements:

- Create auth routes and controller
- Validate required fields
- Reject duplicate emails
- Hash passwords using bcrypt
- Return appropriate status codes

Keep the implementation minimal and test-driven.

---

## Prompt 13 — Refactor Registration

Refactor the registration feature.

Requirements:

- Move business logic to a service layer
- Keep controllers thin
- Preserve all existing tests
- Improve readability

---

## Prompt 14 — Login Tests

Write integration tests using Jest and Supertest for:

POST /api/auth/login

Test cases:

- Login with valid credentials
- Reject invalid password
- Reject non-existent users
- Reject requests with missing email or password

Do not implement the endpoint yet.

---

## Prompt 15 — Login Endpoint

Implement POST /api/auth/login.

Requirements:

- Verify email and password
- Generate a JWT token
- Return user details and token
- Return appropriate error messages and status codes

Keep the implementation minimal and test-driven.

---

## Prompt 16 — Refactor Authentication

Refactor the authentication module.

Requirements:

- Move login logic to the service layer
- Keep controllers thin
- Reuse helper functions where possible
- Preserve all existing tests

---

## Prompt 17 — Authentication Middleware

Create JWT authentication middleware.

Requirements:

- Read the token from the Authorization header
- Verify the JWT
- Attach the authenticated user to the request
- Return proper error responses for invalid or missing tokens

---

## Prompt 18 — Admin Middleware

Create authorization middleware for admin-only routes.

Requirements:

- Allow access only to users with the admin role
- Return appropriate error responses for unauthorized users
- Keep the middleware reusable

---

## Prompt 19 — Vehicle Model

Create a Mongoose Vehicle model.

Requirements:

- make
- model
- category
- price
- quantity

The category should support:

- SUV
- Sedan
- Hatchback
- Luxury
- Electric

Add timestamps and validations.

---

## Prompt 20 — Vehicle Creation Tests

Write integration tests using Jest and Supertest for:

POST /api/vehicles

Test cases:

- Admin can create a vehicle
- Normal users cannot create a vehicle
- Reject requests with missing fields

Do not implement the endpoint yet.

---

## Prompt 21 — Vehicle Creation Endpoint

Implement POST /api/vehicles.

Requirements:

- Create routes and controllers
- Allow only admin users
- Validate required fields
- Return appropriate status codes

Keep the implementation minimal and test-driven.

---

## Prompt 22 — Refactor Vehicle Creation

Refactor the vehicle creation feature.

Requirements:

- Move business logic to a service layer
- Keep controllers thin
- Preserve all existing tests

---

## Prompt 23 — Vehicle Listing Tests

Write integration tests using Jest and Supertest for:

GET /api/vehicles

Test cases:

- Return all vehicles
- Return an empty array when no vehicles exist
- Return vehicles with correct fields

Do not implement the endpoint yet.

---

## Prompt 24 — Vehicle Listing Endpoint

Implement GET /api/vehicles.

Requirements:

- Return all vehicles
- Use proper status codes
- Keep the implementation minimal and test-driven.

---

## Prompt 25 — Vehicle Search Tests

Write integration tests using Jest and Supertest for:

GET /api/vehicles/search

Support:

- make
- model
- category
- minPrice
- maxPrice

Test cases:

- Search by make
- Search by model
- Search by category
- Search by price range
- Return an empty array when no vehicles match

Do not implement the endpoint yet.

---

## Prompt 26 — Vehicle Search Endpoint

Implement GET /api/vehicles/search.

Requirements:

- Support filtering by make, model, category, minPrice and maxPrice
- Build the MongoDB query dynamically
- Return matching vehicles

---

## Prompt 27 — Refactor Search

Move search logic to the service layer.

---

## Prompt 28 — Vehicle Update Tests

Write integration tests using Jest and Supertest for:

PUT /api/vehicles/:id

Test cases:

- Admin can update a vehicle
- Normal users cannot update a vehicle
- Reject invalid vehicle IDs
- Reject invalid data

Do not implement the endpoint yet.

---

## Prompt 29 — Vehicle Update Endpoint

Implement PUT /api/vehicles/:id.

---

## Prompt 30 — Refactor Update

Move update logic to the service layer.

---

## Prompt 31 — Vehicle Deletion Tests

Write integration tests using Jest and Supertest for:

DELETE /api/vehicles/:id

---

## Prompt 32 — Vehicle Deletion Endpoint

Implement DELETE /api/vehicles/:id.

---

## Prompt 33 — Refactor Deletion

Move deletion logic to the service layer.

---

## Prompt 34 — Vehicle Purchase Tests

Write integration tests using Jest and Supertest for:

POST /api/vehicles/:id/purchase.

---

## Prompt 35 — Vehicle Purchase Endpoint

Implement vehicle purchase functionality with atomic quantity updates.

---

## Prompt 36 — Vehicle Restock Tests

Write integration tests using Jest and Supertest for:

POST /api/vehicles/:id/restock.

---

## Prompt 37 — Vehicle Restock Endpoint

Implement vehicle restock functionality.

---

## Prompt 38 — Frontend Setup

Set up the frontend using:

- React with Vite
- Tailwind CSS
- Axios
- React Router DOM

Create folders for:

- pages
- components
- api
- context
- routes
- hooks

Configure Tailwind CSS and Axios.

---

## Prompt 39 — Authentication Pages

Create Login and Register pages.

Requirements:

- Add forms
- Connect to backend APIs using Axios
- Handle loading and error states

---

## Prompt 40 — Authentication Context

Create authentication state management using React Context API.

Requirements:

- Store logged-in user and JWT token
- Implement login and logout
- Persist authentication state

---

## Prompt 41 — Protected Routes

Create protected routes and admin-only routes.

---

## Prompt 42 — Dashboard

Create a dashboard page that displays all vehicles.

---

## Prompt 43 — Search and Filters

Add search and filtering by:

- make
- model
- category
- price range

---

## Prompt 44 — Admin Panel

Create an admin panel.

Requirements:

- Add vehicle
- Update vehicle
- Delete vehicle
- Restock vehicle

---

## Prompt 45 — Documentation

Create README.md and document:

- Setup instructions
- API endpoints
- Testing steps
- AI usage notes
