const request = require('supertest');
const app = require('../app');

const db = require('../db/db');

let agent;

beforeAll(async () => {
  await db.migrate.latest();
  await db.seed.run();

  agent = request.agent(app);

  const loginResponse = await agent
    .post('/api/users/login')
    .send({ name: 'jen', password: '123321' });
  expect(loginResponse.statusCode).toBe(200);
});

let inValidAgent;

beforeAll(async () => {
  inValidAgent = request.agent(app);

  const loginResponse = await inValidAgent
    .post('/api/users/login')
    .send({ name: 'bill', password: 'wrongpassword' });
  expect(loginResponse.statusCode).toBe(401);
});

afterAll(async () => {
  await db.destroy();
});

describe('GET /api/visits', () => {
  it('should respond with status 200 with valid password', async () => {
    const res = await agent.get('/api/visits');
    expect(res.statusCode).toEqual(200);
    expect(res.body[0]).toHaveProperty('user');
    expect(res.body[0]).toHaveProperty('country');
    expect(res.body.id).not.toBe(null);
  });
  it('should respond with status 401 with invalid password', async () => {
    const res = await inValidAgent.get('/api/visits');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /api/visits', () => {
  it('should respond with a single visit with valid password', async () => {
    const res = await agent.get('/api/visits/13');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user_id');
    expect(res.body.user_id).toEqual(1);
    expect(res.body).toHaveProperty('arrival_time');
    expect(res.body.departure_time).toEqual('2022-10-30T23:00:00.000Z');
  });
  it('should not respond with a single visit with invalid password', async () => {
    const res = await inValidAgent.get('/api/visits/25');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /api/visits', () => {
  const visit = {
    userId: 1,
    countryId: 2,
    arrivalTime: '2023-05-23T13:30:00.000Z',
    departureTime: '2023-05-24T13:30:00.000Z',
  };

  it.only('should respond with a new visit with valid token', async () => {
    const res = await agent
      .post('/api/visits')
      .send(visit);
    console.log('post/api/visits test', res.body);

    visit.id = res.body.id;
    expect(res.statusCode).toEqual(201);
    expect(typeof res.body.arrivalTime).toEqual('string');
    expect(res.body).toHaveProperty('countryId');
    expect(res.body).toHaveProperty('departureTime');
    expect(res.body.userId).toEqual(visit.userId);
    expect(res.body.departureTime).toEqual(visit.departureTime);
  });

  it.only('should not respond with a new visit with invalid password', async () => {
    const res = await inValidAgent
      .post('/api/visits')
      .send(visit);
    // visit.id = res.body.id;
    // console.log(visit.id, 'xyz');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });

  it.only('should retrieve the new post in the DB with valid token', async () => {
    const res = await agent.get(
      `/api/visits/${visit.id}`,
    );
    expect(res.statusCode).toEqual(200);
    expect(typeof res.body.user_id).toEqual('number');
    expect(res.body).toHaveProperty('arrival_time');
    expect(res.body.arrival_time).toEqual(visit.arrivalTime);
    console.log(res.body);
    expect(res.body.country).toHaveProperty('id');
  });

  it.only('should not create the visit in the DB with invalid password', async () => {
    const res = await inValidAgent.get(
      `/api/visits/${visit.id}`,
    );
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /api/visits/(with timezone)', () => {
  const visit = {
    user_id: 2,
    country_id: 3,
    arrival_time: '2022-10-27T09:27:25.000+0100',
    departure_time: '2022-10-26T09:27:25.000Z',
  };
  const expectedArrivalTime = '2022-10-27T08:27:25.000Z';

  it('should respond with a new visit with valid password', async () => {
    const res = await agent
      .post('/api/visits/')
      .send(visit);
    visit.id = res.body.id;
    expect(res.statusCode).toEqual(201);
    expect(res.body.arrival_time).toEqual(expectedArrivalTime);
  });

  it('should not respond with a new visit with invalid password', async () => {
    const res = await inValidAgent
      .post('/api/visits/')
      .send(visit);
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });

  it('should create the visit in the DB with valid password', async () => {
    const res = await agent.get(
      `/api/visits/${visit.id}`,
    );
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('arrival_time');
    expect(res.body.arrival_time).toEqual(expectedArrivalTime);
  });

  it('should not create the visit in the DB with invalid password', async () => {
    const res = await inValidAgent.get(
      `/api/visits/${visit.id}`,
    );
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /new-visits', () => {
  it('should respond with status 200 with valid password', async () => {
    const res = await agent.get('/new-visits/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('name');
    expect(res.text).toContain('country');
    expect(res.text).not.toBe(null);
  });
  it('should respond with status 401 with invalid password', async () => {
    const res = await inValidAgent.get('/api/visits');

    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /new-visits', () => {
  it('should respond with status 200 with valid password', async () => {
    const res = await agent.get('/new-visits/');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain('name');
    expect(res.text).toContain('country');
    expect(res.text).not.toBe(null);
  });
  it('should respond with status 401 with invalid password', async () => {
    const res = await inValidAgent.get('/new-visits/');
    expect(res.statusCode).toEqual(401);
    expect(res.body.status).toEqual(401);
    expect(res.body).toHaveProperty('message');
  });
});
