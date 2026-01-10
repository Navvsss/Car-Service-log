# Car Service Logbook Backend

This is the backend API for the Car Service Logbook application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (signup, login)
- Vehicle management (CRUD operations)
- Service record management (CRUD operations)
- Admin panel with full CRUD capabilities for all entities
- RESTful API design

## API Endpoints

### Users
- `POST /api/users/signup` - Create a new user
- `POST /api/users/create-admin` - Create an admin user
- `POST /api/users/login` - Login user
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get a user by ID
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

### Vehicles
- `POST /api/vehicles` - Create a new vehicle
- `GET /api/vehicles/:userId` - Get all vehicles for a user
- `GET /api/vehicles/admin` - Get all vehicles (admin only)
- `GET /api/vehicles/vehicle/:id` - Get a vehicle by ID
- `PUT /api/vehicles/:id` - Update a vehicle
- `DELETE /api/vehicles/:id` - Delete a vehicle

### Services
- `POST /api/services` - Create a new service record
- `GET /api/services/:userId` - Get all services for a user
- `GET /api/services/admin` - Get all services (admin only)
- `GET /api/services/vehicle/:vehicleId` - Get all services for a vehicle
- `GET /api/services/:id` - Get a service by ID
- `PUT /api/services/:id` - Update a service
- `DELETE /api/services/:id` - Delete a service

## Admin Panel

The admin panel is accessible at `/admin` and provides a web interface for managing all users, vehicles, and service records. To access the admin panel:

1. Create an admin user using the API or the create-admin script
2. Navigate to `http://localhost:3000/admin`
3. Enter the admin user's email and password when prompted

### Creating an Admin User

You can create an admin user in two ways:

1. Using the API endpoint:
   ```
   POST /api/users/create-admin
   {
     "name": "Admin User",
     "email": "admin@example.com",
     "password": "admin123"
   }
   ```

2. Using the create-admin script:
   ```bash
   npm run create-admin
   ```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Make sure MongoDB is running on your system

3. Start the server:
   ```bash
   npm start
   ```

## Development

For development with auto-restart:
```bash
npm run dev
```