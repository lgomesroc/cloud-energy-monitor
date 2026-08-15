import { Router } from "express";
import {
  getEnergyReadings,
  getEnergyReadingsByDevice,
} from "../services/energy.service.js";

const energyRouter = Router();

energyRouter.get("/energy", async (request, response) => {
  const limit = Number(request.query.limit ?? 2);

  const lastKey = request.query.lastKey
    ? JSON.parse(
        Buffer.from(String(request.query.lastKey), "base64").toString("utf-8"),
      )
    : undefined;

  const result = await getEnergyReadings(limit, lastKey);

  const encodedLastKey = result.lastEvaluatedKey
    ? Buffer.from(JSON.stringify(result.lastEvaluatedKey)).toString("base64")
    : undefined;

  response.json({
    readings: result.readings,
    ...(encodedLastKey
      ? { lastKey: encodedLastKey }
      : {}),
  });
});

energyRouter.get("/energy/:deviceId", async (request, response) => {
  const { deviceId } = request.params;

  const readings = await getEnergyReadingsByDevice(deviceId);

  response.json(readings);
});

export default energyRouter;
