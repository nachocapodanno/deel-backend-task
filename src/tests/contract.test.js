const request = require('supertest');
const app = require('../app');

describe('Contracts Endpoints', () => {
  it('should return the contract only if it belongs to the profile calling', async () => {
    const contractId = 1;
    const profileId = 1;

    const res = await request(app)
      .get(`/contracts/${contractId}`)
      .set('profile_id', profileId);

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toEqual(contractId);
  });

  it('should not return the contract - it does not belong to the profile calling', async () => {
    const contractId = 1;
    const profileId = 2;

    const res = await request(app)
      .get(`/contracts/${contractId}`)
      .set('profile_id', profileId);

    expect(res.statusCode).toEqual(404);
  });

  it('should return a list of non-terminated contracts belonging to a user (client or contractor)', async () => {
    const profileId = 1;

    const res = await request(app)
      .get('/contracts/')
      .set('profile_id', profileId);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });
});
