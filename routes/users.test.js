const request = require('supertest');
const { afterEach } = require('node:test');
const app = require('../app');
const db = require('../db/db');
const users = require('../models/users');

// Update the database with the latest schema and load seed data before
// running tests. If NODE_ENV is set to `test` then the database used
// during testing will be held in memory for the duration of the tests
// and then discarded.

let agent;

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();

  agent = request.agent(app);

  const loginResponse = await agent
    .post('/api/users/login')
    .send({ name: 'jen', password: '123321' });

  console.log('loginResponse.statusCode', loginResponse.statusCode);

  expect(loginResponse.statusCode).toBe(200);
});

let inValidAgent;

beforeAll(async () => {
  inValidAgent = request.agent(app);

  const loginResponse = await inValidAgent
    .post('/api/users/login')
    .send({ name: 'bill', password: 'wrongpassword' });
  console.log('nonValid loginResponse.statusCode', loginResponse.statusCode);
  expect(loginResponse.statusCode).toBe(401);
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
  it('should respond with an array of users with valid password', async () => {
    const res = await agent.get('/api/users');
    console.log('response', JSON.stringify(res));
    // The values for the expected result are based on those defined
    // in seed data. See /seeds/create-test-users.js
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].id).toEqual(1);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0].name).toEqual('jen');
  });
  it('should not respond with an array of users with invalid password', async () => {
    const res = await inValidAgent.get('/api/users');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /api/users/2', () => {
  it('should respond with a single user with valid password', async () => {
    const res = await agent.get('/api/users/2');
    console.log('response 2', JSON.stringify(res));
    // The values for the expected result are based on those defined
    // in seed data. See /seeds/create-test-users.js
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(2);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('bill');
  });
  it('should not respond with a single user with invalid password', async () => {
    const res = await inValidAgent.get('/api/users/2');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /api/users', () => {
  it('should respond with a new user', async () => {
    const userName = `pie_${Date.now()}`;
    const userPassword = 'secret_password';
    const userEmail = `email_${Date.now()}@test.com`;
    const res = await request(app).post('/api/users').send({ name: userName, user_email: userEmail, user_password: userPassword });
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
    const userEmail = `email_${Date.now()}@test.com`;
    const userPassword = 'secret_password';
    const newUser = await users.create(userName, userEmail, userPassword);
    const res = await agent.get(
      `/api/users/${newUser.id}`,
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(newUser.id);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual(newUser.name);
  });

  it('should not create the same user twice', async () => {
    const name = `chocolate_${Date.now()}`;
    const userEmail = `email_${Date.now()}@test.com`;
    const userPassword = 'secret_password';
    await users.create(name, userEmail, userPassword);
    const res = await agent.post('/api/users').send({ name, user_email: userEmail, user_password: userPassword });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('status');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual(`user '${name}' already exists`);
  });
});

describe('GET /api/users/me/account-status', () => {
  it('should return active status for a normal account', async () => {
    const res = await agent.get('/api/users/me/account-status');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('active');
    expect(res.body.canDelete).toEqual(false);
    expect(res.body.deactivatedAt).toBeNull();
    expect(res.body.deletionEligibleAt).toBeNull();
  });

  it('should return 401 for unauthenticated user', async () => {
    const res = await inValidAgent.get('/api/users/me/account-status');
    expect(res.statusCode).toEqual(401);
  });
});

describe('POST /api/users/me/deactivate', () => {
  it('should deactivate the authenticated user account', async () => {
    // Create a new user and login to get a fresh agent for deactivation tests
    const deactivateAgent = request.agent(app);
    const userName = `deactivate_user_${Date.now()}`;
    const userEmail = `deactivate_${Date.now()}@test.com`;
    const userPassword = 'test_password';

    // Register via the authentication endpoint
    await deactivateAgent
      .post('/api/authentication/register')
      .send({ name: userName, userEmail, userPassword });

    const res = await deactivateAgent.post('/api/users/me/deactivate');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('deactivated');
    expect(res.body).toHaveProperty('deactivatedAt');
    expect(res.body).toHaveProperty('deletionEligibleAt');
  });

  it('should return 401 for unauthenticated user', async () => {
    const res = await inValidAgent.post('/api/users/me/deactivate');
    expect(res.statusCode).toEqual(401);
  });
});

describe('POST /api/users/me/reactivate', () => {
  it('should reactivate a deactivated account', async () => {
    // Create, login, deactivate, then reactivate
    const reactivateAgent = request.agent(app);
    const userName = `reactivate_user_${Date.now()}`;
    const userEmail = `reactivate_${Date.now()}@test.com`;
    const userPassword = 'test_password';

    await reactivateAgent
      .post('/api/authentication/register')
      .send({ name: userName, userEmail, userPassword });

    // Deactivate (this logs the user out)
    await reactivateAgent.post('/api/users/me/deactivate');

    // Need to log back in to reactivate — but the account is deactivated.
    // Reactivation requires authentication, so we manually set status back
    // to test the endpoint. In production, reactivation would be done
    // through a special flow. For testing, we directly update the DB.
    const user = await db('users').where({ name: userName }).first('id');
    await db('users').where({ id: user.id }).update({ account_status: 'active' });

    // Login again
    await reactivateAgent
      .post('/api/authentication/login')
      .send({ userEmail, userPassword });

    // Now deactivate again
    await reactivateAgent.post('/api/users/me/deactivate');

    // Manually set active to allow login for reactivation test
    await db('users').where({ id: user.id }).update({ account_status: 'active' });

    // Login again
    await reactivateAgent
      .post('/api/authentication/login')
      .send({ userEmail, userPassword });

    // Deactivate in the DB (but keep session active for testing)
    await db('users').where({ id: user.id }).update({
      account_status: 'deactivated',
      deactivated_at: new Date().toISOString(),
    });

    const res = await reactivateAgent.post('/api/users/me/reactivate');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('reactivated');
  });

  it('should return 400 when trying to reactivate an active account', async () => {
    const res = await agent.post('/api/users/me/reactivate');
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('not deactivated');
  });
});

describe('DELETE /api/users/me', () => {
  it('should immediately delete account with correct password', async () => {
    const deleteAgent = request.agent(app);
    const userName = `delete_user_${Date.now()}`;
    const userEmail = `delete_${Date.now()}@test.com`;
    const userPassword = 'test_password';

    await deleteAgent
      .post('/api/authentication/register')
      .send({ name: userName, userEmail, userPassword });

    const res = await deleteAgent
      .delete('/api/users/me')
      .send({ password: userPassword, immediate: true });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('permanently deleted');

    // Verify user no longer exists
    const deletedUser = await db('users').where({ name: userName }).first();
    expect(deletedUser).toBeUndefined();
  });

  it('should reject delete with wrong password', async () => {
    const deleteAgent = request.agent(app);
    const userName = `delete_wrong_pw_${Date.now()}`;
    const userEmail = `delete_wrong_${Date.now()}@test.com`;
    const userPassword = 'test_password';

    await deleteAgent
      .post('/api/authentication/register')
      .send({ name: userName, userEmail, userPassword });

    const res = await deleteAgent
      .delete('/api/users/me')
      .send({ password: 'wrong_password', immediate: true });

    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toContain('Invalid password');
  });

  it('should reject delete without password', async () => {
    const res = await agent
      .delete('/api/users/me')
      .send({});

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('Password is required');
  });

  it('should reject non-immediate delete when account is not deactivated', async () => {
    const deleteAgent = request.agent(app);
    const userName = `delete_noDeact_${Date.now()}`;
    const userEmail = `delete_noDeact_${Date.now()}@test.com`;
    const userPassword = 'test_password';

    await deleteAgent
      .post('/api/authentication/register')
      .send({ name: userName, userEmail, userPassword });

    const res = await deleteAgent
      .delete('/api/users/me')
      .send({ password: userPassword });

    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toContain('must be deactivated');
  });

  it('should reject non-immediate delete when 30 days have not passed', async () => {
    const deleteAgent = request.agent(app);
    const userName = `delete_30d_${Date.now()}`;
    const userEmail = `delete_30d_${Date.now()}@test.com`;
    const userPassword = 'test_password';

    await deleteAgent
      .post('/api/authentication/register')
      .send({ name: userName, userEmail, userPassword });

    // Deactivate account directly in DB (keep session alive for testing)
    const user = await db('users').where({ name: userName }).first('id');
    await db('users').where({ id: user.id }).update({
      account_status: 'deactivated',
      deactivated_at: new Date().toISOString(), // just now, not 30 days ago
    });

    const res = await deleteAgent
      .delete('/api/users/me')
      .send({ password: userPassword });

    expect(res.statusCode).toEqual(403);
    expect(res.body.error).toContain('30-day waiting period');
    expect(res.body).toHaveProperty('deletionEligibleAt');
  });

  it('should allow non-immediate delete after 30 days have passed', async () => {
    const deleteAgent = request.agent(app);
    const userName = `delete_eligible_${Date.now()}`;
    const userEmail = `delete_eligible_${Date.now()}@test.com`;
    const userPassword = 'test_password';

    await deleteAgent
      .post('/api/authentication/register')
      .send({ name: userName, userEmail, userPassword });

    // Set deactivated_at to 31 days ago
    const user = await db('users').where({ name: userName }).first('id');
    const thirtyOneDaysAgo = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString();
    await db('users').where({ id: user.id }).update({
      account_status: 'deactivated',
      deactivated_at: thirtyOneDaysAgo,
    });

    const res = await deleteAgent
      .delete('/api/users/me')
      .send({ password: userPassword });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('permanently deleted');

    // Verify user no longer exists
    const deletedUser = await db('users').where({ name: userName }).first();
    expect(deletedUser).toBeUndefined();
  });
});

