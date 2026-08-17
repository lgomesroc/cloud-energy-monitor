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
});
