import { Router } from "express";
import {
  getEnergyReadings,
  getEnergyReadingsByDevice,
} from "../services/energy.service.js";

const energyRouter = Router();

energyRouter.get("/energy", async (request, response) => {
  try {
    const limit = Number(request.query.limit ?? 2);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      response.status(400).json({
        error: "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
      });
      return;
    }

    let lastKey: Record<string, unknown> | undefined;

    if (request.query.lastKey) {
      try {
        lastKey = JSON.parse(
          Buffer.from(
            String(request.query.lastKey),
            "base64",
          ).toString("utf-8"),
        );
      } catch {
        response.status(400).json({
          error: "O parâmetro lastKey é inválido.",
        });
        return;
      }
    }

    const result = await getEnergyReadings(limit, lastKey);

    const encodedLastKey = result.lastEvaluatedKey
      ? Buffer.from(
          JSON.stringify(result.lastEvaluatedKey),
        ).toString("base64")
      : undefined;

    response.status(200).json({
      readings: result.readings,
      ...(encodedLastKey
        ? { lastKey: encodedLastKey }
        : {}),
    });
  } catch (error) {
    console.error("Erro ao buscar leituras de energia:", error);

    response.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
});

energyRouter.get("/energy/:deviceId", async (request, response) => {
  try {
    const { deviceId } = request.params;

    const readings = await getEnergyReadingsByDevice(deviceId);

    response.status(200).json(readings);
  } catch (error) {
    console.error("Erro ao buscar leituras do dispositivo:", error);

    response.status(500).json({
      error: "Erro interno do servidor.",
    });
  }
});

export default energyRouter;
