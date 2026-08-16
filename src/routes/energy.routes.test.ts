import { afterEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import app from "../index.js";
import * as energyRepository from "../repositories/energy.repository.js";

describe("Energy Routes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return energy readings with valid limit", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: 2 });

    expect(response.status).toBe(200);
    expect(response.body.readings).toBeInstanceOf(Array);
  });

  it("should accept limit 1", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: 1 });

    expect(response.status).toBe(200);
  });

  it("should accept limit 100", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: 100 });

    expect(response.status).toBe(200);
  });

  it("should reject limit greater than 100", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: 101 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
    );
  });

  it("should reject negative limit", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: -1 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
    );
  });

  it("should reject decimal limit", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: 1.5 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
    );
  });

  it("should return 400 when limit is not a number", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: "abc" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
    );
  });

  it("should return 400 when limit is zero", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: 0 });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
    );
  });

  it("should return 400 when lastKey is invalid", async () => {
    const response = await request(app)
      .get("/api/energy")
      .query({ lastKey: "abc" });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      "O parâmetro lastKey é inválido.",
    );
  });

  it("should paginate energy readings using lastKey", async () => {
    const firstResponse = await request(app)
      .get("/api/energy")
      .query({ limit: 2 });

    expect(firstResponse.status).toBe(200);
    expect(firstResponse.body.readings).toHaveLength(2);
    expect(firstResponse.body.lastKey).toBeDefined();

    const secondResponse = await request(app)
      .get("/api/energy")
      .query({
        limit: 2,
        lastKey: firstResponse.body.lastKey,
      });

    expect(secondResponse.status).toBe(200);
    expect(secondResponse.body.readings).toHaveLength(2);
  });

  it("should return 500 when DynamoDB access fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
  
    vi.spyOn(
      energyRepository,
      "findAllEnergyReadings",
    ).mockRejectedValue(new Error("DynamoDB error"));
  
    const response = await request(app)
      .get("/api/energy")
      .query({ limit: 2 });
  
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(
      "Erro interno do servidor.",
    );
  
    expect(consoleErrorSpy).toHaveBeenCalled();
  
    consoleErrorSpy.mockRestore();
  });
});
