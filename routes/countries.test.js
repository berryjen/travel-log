const request = require('supertest');
const app = require('../app');
const db = require('../db/db');

// Update the database with the latest schema and load seed data before
// running tests. If NODE_ENV is set to `test` then the database used
// during testing will be held in memory for the duration of the tests
// and then discarded.
beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();
});

// After tests have completed, destroy the database as the test data is no
// longer needed.
afterAll(async () => {
  await db.destroy();
});

describe('GET /api/countries', () => {
  it('should respond with an array of countries', async () => {
    const res = await request(app).get('/api/countries');

    // The values for the expected result are based on those defined
    // in seed data. See /seeds/create-test-countries.js
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(240);
    expect(res.body[36]).toHaveProperty('id');
    expect(res.body[36].id).toEqual(37); // the array index begins at 0 but id starts at 1
    expect(res.body[36]).toHaveProperty('name');
    expect(res.body[36].name).toEqual('Canada');
  });
});

describe('GET /api/countries/37', () => {
  it('should respond with a single country', async () => {
    const res = await request(app).get('/api/countries/37');

    // The values for the expected result are based on those defined
    // in seed data. See /seeds/create-test-countries.js
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.id).toEqual(37);
    expect(res.body).toHaveProperty('name');
    expect(res.body.name).toEqual('Canada');
  });
});
