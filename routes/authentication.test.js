const request = require('supertest');
const app = require('../app');
const db = require('../db/db');

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

afterAll(async () => {
  await db.destroy();
});

describe('POST /register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'testUser',
        userEmail: 'test@example.com',
        userPassword: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toEqual('User created successfully');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user).toHaveProperty('userEmail');
    expect(res.body.user.userEmail).toEqual('test@example.com');
  });

  it('should not register an existing user', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        name: 'jen',
        userEmail: 'jen@hotmail.com',
        userPassword: 'password123',
      });
    expect(res.statusCode).toEqual(409);
    expect(res.body.error).toEqual('User already exists with this email');
  });
});
