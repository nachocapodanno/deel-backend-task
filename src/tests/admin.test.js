const request = require("supertest");
const moment = require("moment");
const app = require("../app");

describe("Admin Endpoints", () => {
  it("should return the profession that earned the most money (sum of jobs paid) for any contractor that worked in the query time range", async () => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().add(5, "days").format("YYYY-MM-DD");
    const res = await request(app).get(
      `/admin/best-profession?start=${startDate}&end=${endDate}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual("Programmer");
  });

  it("should return the profession that earned the most money - date range without results", async () => {
    const startDate = moment().add(10, "years").format("YYYY-MM-DD");
    const endDate = moment().add(10, "years").format("YYYY-MM-DD");

    const res = await request(app).get(
      `/admin/best-profession?start=${startDate}&end=${endDate}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return the clients the paid the most for jobs in the query time period and limit set - date without results", async () => {
    const startDate = moment().add(10, "years").format("YYYY-MM-DD");
    const endDate = moment().add(10, "years").format("YYYY-MM-DD");
    const limit = 3;

    const res = await request(app).get(
      `/admin/best-clients?start=${startDate}&end=${endDate}&limit=${limit}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);
  });

  it("should return the clients the paid the most for jobs in the query time period and not limit set - return 2 results", async () => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().add(5, "days").format("YYYY-MM-DD");

    const res = await request(app).get(
      `/admin/best-clients?start=${startDate}&end=${endDate}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(2);
  });

  it("should return the clients the paid the most for jobs in the query time period and limit set - return 3 results", async () => {
    const startDate = moment().format("YYYY-MM-DD");
    const endDate = moment().add(5, "days").format("YYYY-MM-DD");
    const limit = 3;

    const res = await request(app).get(
      `/admin/best-clients?start=${startDate}&end=${endDate}&limit=${limit}`
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toEqual(3);
  });
});
