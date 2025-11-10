const request = require('supertest');
const { afterEach } = require('node:test');
const app = require('../app');
const db = require('../db/db');
const users = require('../models/users');

// Update the database with the latest schema and load seed data before
// running tests. If NODE_ENV is set to `test` then the database used
// during testing will be held in memory for the duration of the tests
// and then discarded.

// let authToken = '';
// const jenBasicAuth = `Basic ${Buffer.from('jen:123321').toString('base64')}`;
let agent;


// If you use request(app) instead of agent:
// No cookie is sent
// req.session.passport is undefined
// passport.session() doesn't set req.user
// req.isAuthenticated() returns false
// requireAuth returns 401


// Login Request:
// ┌─────────────────────────────────────────┐
// │ agent.post('/login')                     │
// │   ↓                                      │
// │ passport.authenticate('local')          │
// │   ↓                                      │
// │ serializeUser(user) → stores user.id    │
// │   ↓                                      │
// │ express-session creates session         │
// │   ↓                                      │
// │ Response: Set-Cookie: connect.sid=...  │
// │   ↓                                      │
// │ agent stores cookie ✅                   │
// └─────────────────────────────────────────┘

// Protected Request:
// ┌─────────────────────────────────────────┐
// │ agent.get('/api/users')                  │
// │   ↓                                      │
// │ agent sends cookie automatically        │
// │   ↓                                      │
// │ express-session reads cookie            │
// │   ↓                                      │
// │ passport.session() deserializes        │
// │   ↓                                      │
// │ req.user = { id: 1, name: 'jen' }      │
// │ req.isAuthenticated() = true            │
// │   ↓                                      │
// │ requireAuth checks → ✅ authenticated   │
// │   ↓                                      │
// │ usersController.list()                  │
// └─────────────────────────────────────────┘

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();

  agent = request.agent(app);

  // Login using the same agent so the returned session cookie is stored
  const loginResponse = await agent.post('/api/users/login').send({ name: 'jen', password: '123321' });
  expect(loginResponse.statusCode).toBe(200);
  // authToken = loginResponse.body.token;

});

// After tests have completed, destroy the database as the test data is no
// longer needed.
afterAll(async () => {
  await db.destroy();
});

describe('GET /api/users', () => {
  let createdUserId;
  afterEach(async () => {
    if (createdUserId) {
      try {
        await db('users').where('id', createdUserId).del();
      } catch (error) {
        console.error(`Error deleting user with id ${createdUserId}:`, error);
      }
      createdUserId = null;
    }
  });
  it('should respond with an array of users with valid session', async () => {
    // Use the 'agent' to automatically send the session cookie
    const res = await agent.get('/api/users');
    // The values for the expected result are based on those defined
    // in seed data. See /seeds/create-test-users.js
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0].name).toEqual('jen');
  });
  it('should not respond with an array of users without authentication', async () => {
    // Use a fresh request without session (not the authenticated agent)
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /api/users/2', () => {
  it('should respond with a single user with valid password', async () => {
    const res = await request(app).get('/api/users/2/?access_token=ABC123');
    // The values for the expected result are based on those defined
    // in seed data. See /seeds/create-test-users.js
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(2);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('bill');
  });
  it('should not respond with a single user with invalid password', async () => {
    const res = await request(app).get('/api/users/2/?access_token=ABC124');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /api/users', () => {
  it('should respond with a new user', async () => {
    const userName = `pie_${Date.now()}`;
    const res = await request(app).post('/api/users').send({ name: userName });
    expect(res.statusCode).toEqual(201);
    expect(typeof res.body.id).toEqual('number');
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(userName);

    // // Keep the user.id for use in subsequent tests
    // look in database and check the user exists
    const createdUser = await users.get_by_id(res.body.id);
    expect(createdUser.name).toEqual(userName);
  });

  it('should create the user in the DB', async () => {
    const userName = `cake_${Date.now()}`;
    const newUser = await users.create(userName);
    const res = await request(app).get(
      `/api/users/${newUser.id}/?access_token=ABC123`,
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(newUser.id);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(newUser.name);
  });

  it('should not create the same user twice', async () => {
    const name = `chocolate_${Date.now()}`;
    await users.create(name);
    const res = await request(app).post('/api/users').send({ name });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body.status).toEqual(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual(`user '${name}' already exists`);
  });
});
