const request = require("supertest");
const app = require("../app");

describe("Jobs Endpoints", () => {
  it("should return all unpaid jobs (1) for a user with active contracts only", async () => {
    const profileId = 1;

    const res = await request(app)
      .get(`/jobs/unpaid`)
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(1);
  });

  it("should pay for a job - wrong job id - 404 returned", async () => {
    const profileId = 1;
    const jobId = 9999;

    const res = await request(app)
      .post(`/jobs/${jobId}/pay`)
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Not validate job to pay" });
  });

  it("should pay for a job - job id OK - payment Ok", async () => {
    const profileId = 2;
    const jobId = 3;

    const res = await request(app)
      .post(`/jobs/${jobId}/pay`)
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Payment done" });
  });

  it("should pay for a job - not enough client balance - return error 404 ", async () => {
    const profileId = 2;
    const jobId = 4;

    const res = await request(app)
      .post(`/jobs/${jobId}/pay`)
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(404);
    expect(res.body).toEqual({ error: "Not enough client balance" });
  });
});
