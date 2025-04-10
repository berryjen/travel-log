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

describe('Get /tokens', () => {
  it('should respond with status 200 with valid token', async () => {
    const res = await request(app).get('/api/tokens?access_token=ABC123');
    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty('user_id');
    expect(res.body[1]).toHaveProperty('bearer_token');
    expect(res.body.id).not.toBe(null);
  });
  it('should respond with status 401 with invalid token', async () => {
    const res = await request(app).get('/api/tokens?access_token=ABC124');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /tokens/1', () => {
  it('should respond with a single valid token', async () => {
    const res = await request(app).get('/api/tokens/1/?access_token=DEF456');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body).toHaveProperty('bearer_token');
    expect(res.body.user_id).toEqual(1);
  });
  it('should respond with a single invalid token- unauthorized', async () => {
    const res = await request(app).get('/api/tokens/1/?access_token=DEF457');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});
