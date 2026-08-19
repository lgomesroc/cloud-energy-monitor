import { describe, expect, it, vi } from "vitest";
import { handler } from "./energy.handler.js";
import * as energyService from "../services/energy.service.js";

describe("energy.handler", () => {
  it("deve retornar as leituras de energia com status 200", async () => {
    vi.spyOn(energyService, "getEnergyReadings").mockResolvedValue({
      readings: [
        {
          deviceId: "device-002",
          timestamp: "2026-08-15T12:05:00Z",
          consumptionKwh: 2.18,
        },
        {
          deviceId: "device-005",
          timestamp: "2026-08-15T12:20:00Z",
          consumptionKwh: 3.12,
        },
      ],
    });

    const event = {
      httpMethod: "GET",
      path: "/api/energy",
      pathParameters: null,
      queryStringParameters: {
        limit: "2",
      },
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    expect(JSON.parse(response.body)).toEqual({
      readings: [
        {
          deviceId: "device-002",
          timestamp: "2026-08-15T12:05:00Z",
          consumptionKwh: 2.18,
        },
        {
          deviceId: "device-005",
          timestamp: "2026-08-15T12:20:00Z",
          consumptionKwh: 3.12,
        },
      ],
    });

    expect(energyService.getEnergyReadings).toHaveBeenCalledWith(
      2,
      undefined,
    );
  });

  it("deve retornar 400 quando o limit for inválido", async () => {
    const event = {
      httpMethod: "GET",
      path: "/api/energy",
      pathParameters: null,
      queryStringParameters: {
        limit: "0",
      },
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
    });
  });

  it("deve retornar 400 quando o lastKey for inválido", async () => {
    const invalidLastKey = Buffer.from("banana").toString("base64");

    const event = {
      httpMethod: "GET",
      path: "/api/energy",
      pathParameters: null,
      queryStringParameters: {
        limit: "2",
        lastKey: invalidLastKey,
      },
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(400);

    expect(JSON.parse(response.body)).toEqual({
      error: "O parâmetro lastKey é inválido.",
    });
  });

  it("deve retornar 500 quando o Service lançar um erro", async () => {
    vi.spyOn(energyService, "getEnergyReadings").mockRejectedValue(
      new Error("Erro ao acessar o serviço"),
    );

    const event = {
      httpMethod: "GET",
      path: "/api/energy",
      pathParameters: null,
      queryStringParameters: {
        limit: "2",
      },
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(500);

    expect(JSON.parse(response.body)).toEqual({
      error: "Erro interno do servidor.",
    });
  });

  it("deve retornar as leituras de um dispositivo com status 200", async () => {
    vi.spyOn(
      energyService,
      "getEnergyReadingsByDevice",
    ).mockResolvedValue([
      {
        deviceId: "device-002",
        timestamp: "2026-08-15T12:05:00Z",
        consumptionKwh: 2.18,
      },
    ]);

    const event = {
      httpMethod: "GET",
      path: "/api/energy/device-002",
      pathParameters: {
        deviceId: "device-002",
      },
      queryStringParameters: null,
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(200);

    expect(JSON.parse(response.body)).toEqual({
      readings: [
        {
          deviceId: "device-002",
          timestamp: "2026-08-15T12:05:00Z",
          consumptionKwh: 2.18,
        },
      ],
    });

    expect(
      energyService.getEnergyReadingsByDevice,
    ).toHaveBeenCalledWith("device-002");
  });

  it("deve utilizar o deviceId recebido em pathParameters", async () => {
    vi.spyOn(
      energyService,
      "getEnergyReadingsByDevice",
    ).mockResolvedValue([]);

    const event = {
      httpMethod: "GET",
      path: "/api/energy/device-005",
      pathParameters: {
        deviceId: "device-005",
      },
      queryStringParameters: null,
    } as any;

    await handler(event);

    expect(
      energyService.getEnergyReadingsByDevice,
    ).toHaveBeenCalledWith("device-005");
  });

  it("deve retornar 500 quando o Service de dispositivo lançar um erro", async () => {
    vi.spyOn(
      energyService,
      "getEnergyReadingsByDevice",
    ).mockRejectedValue(
      new Error("Erro ao acessar o serviço do dispositivo"),
    );

    const event = {
      httpMethod: "GET",
      path: "/api/energy/device-002",
      pathParameters: {
        deviceId: "device-002",
      },
      queryStringParameters: null,
    } as any;

    const response = await handler(event);

    expect(response.statusCode).toBe(500);

    expect(JSON.parse(response.body)).toEqual({
      error: "Erro interno do servidor.",
    });
  });
});
