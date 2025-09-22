# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Travel Log is a Node.js/Express REST API application for tracking travel visits to countries. Users can log where they've been, plan future trips, and manage their travel history. The application uses SQLite for data storage with Knex.js as the query builder and ORM.

## Key Commands

### Development
- `npm run dev` - Start development server with nodemon (auto-restart on changes)
- `npm start` - Start production server
- `npm run lint` - Run ESLint to check code style and catch errors

### Testing
- `npm test` - Run all tests with Jest in verbose mode
- `npm run test-watch` - Run tests in watch mode (re-run on file changes)
- `npm run test1` - Run a specific test file (currently set to visits.test.js)

To run a single test file: `cross-env NODE_ENV=test jest --verbose=true routes/[filename].test.js`

### Database Operations
The application uses Knex.js migrations and seeds:
- `npx knex migrate:latest` - Run latest database migrations
- `npx knex seed:run` - Run database seeds (populate test data)
- `npx knex migrate:rollback` - Rollback last migration

## Architecture Overview

### MVC Pattern
The codebase follows a Model-View-Controller (MVC) architecture:

- **Models** (`/models/`) - Data layer with database operations using Knex.js
- **Controllers** (`/controllers/`) - Business logic layer that processes requests
- **Routes** (`/routes/`) - Express route definitions that map HTTP endpoints to controllers

### Core Components

**Authentication System**: Bearer token-based authentication using Passport.js
- Token generation and validation in `models/tokens.js`
- Authentication middleware configured in `app.js` with passport-http-bearer

**Database Architecture**: 
- SQLite database with snake_case column naming (converted via knex-stringcase)
- Environment-specific configurations: in-memory for tests, file-based for dev/prod
- Core tables: users, countries, visits, bearer_tokens, cities

**API Structure**: 
- All endpoints prefixed with `/api`
- RESTful design with standard HTTP methods
- Consistent error handling with custom error classes

### Key Models

**Countries Model** (`models/countries.js`):
- Manages country data with CRUD operations
- Custom `CountryExistsError` for duplicate handling
- Search functionality by name and ID

**Visits Model** (`models/visits.js`):
- Links users to countries with timestamps
- Date handling with ISO string conversion
- Complex joins between visits, users, and countries
- Custom error classes: `ConstraintIdNullError`, `NotFoundError`

**Users Model** (`models/users.js`):
- User management with token-based lookup
- Integrates with authentication tokens
- Custom `UserExistsError` for duplicates

### Database Environment Management
The application automatically selects database configuration based on NODE_ENV:
- `test`: In-memory SQLite (`:memory:`)
- `production`: File at `/var/opt/travel-log/prod.sqlite3`
- `development`: File at `./dev.sqlite3`

## Development Guidelines

### Testing
- Tests use supertest for HTTP endpoint testing
- Database setup/teardown handled in beforeAll/afterAll hooks
- Test data populated via seeds for consistent test scenarios
- Test environment uses in-memory database for isolation

### Code Style
- ESLint with Airbnb base configuration
- Prettier for code formatting
- Console logging allowed (no-console rule disabled)
- Jest globals enabled for test files

### Error Handling
- Custom error classes for domain-specific errors
- Centralized error handler in app.js
- Status codes set on error objects for HTTP responses
- Consistent error response format with status and message

### Database Patterns
- All models export custom error classes for specific failure modes
- Consistent use of `first()` for single record queries
- Snake case database columns converted to camelCase via knex-stringcase
- Try-catch blocks with specific SQLITE_CONSTRAINT handling