const request = require("supertest");
const app = require("../app");
// const job = require("../models/job");

describe("Balance Endpoints", () => {
  it("should deposits money into the the the balance of a client - contractor profile id - return error", async () => {
    const profileId = 8; // contractor type
    const userId = 1; // client type

    const res = await request(app)
      .post(`/balances/deposit/${userId}`)
      .send({
        amount: 100,
      })
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "Profile is not a client" });
  });

  it("should deposits money into the the the balance of a client - invalid contractor user id - return error", async () => {
    const profileId = 1; // client type
    const userId = 88888;

    const res = await request(app)
      .post(`/balances/deposit/${userId}`)
      .send({
        amount: 100,
      })
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "User id is not a valid client" });
  });

  it("should deposits money into the the the balance of a client - contractor user id - return error", async () => {
    const profileId = 1; // client
    const userId = 8; // contractor

    const res = await request(app)
      .post(`/balances/deposit/${userId}`)
      .send({
        amount: 100,
      })
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "User id is not a valid client" });
  });

  it("should deposits money into the the the balance of a client - amount gratear than client balance - return error", async () => {
    const profileId = 1; // client
    const userId = 2; // client

    const res = await request(app)
      .post(`/balances/deposit/${userId}`)
      .send({
        amount: 10000,
      })
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "Invalid client amount" });
  });

  it("should deposits money into the the the balance of a client - negative amount - return error", async () => {
    const profileId = 1; // client
    const userId = 2; // client

    const res = await request(app)
      .post(`/balances/deposit/${userId}`)
      .send({
        amount: -10000,
      })
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({ error: "Invalid client amount" });
  });

  it("should deposits money into the the the balance of a client - amount OK - return OK", async () => {
    const profileId = 1;
    const userId = 2;

    const res = await request(app)
      .post(`/balances/deposit/${userId}`)
      .send({
        amount: 100,
      })
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Deposit done" });
  });

  it("should deposits money into the the the balance of a client - more than 25% his total jobs to pay - return error", async () => {
    const profileId = 1; // total job to pay amount = 401 - job id 1 and id 2
    const userId = 2;

    const res = await request(app)
      .post(`/balances/deposit/${userId}`)
      .send({
        amount: 200,
      })
      .set("profile_id", profileId);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      error: "Invalid client amount",
    });
  });
});
