import { Router } from "express";
import { energyReadings } from "../data/energy-readings.js";

const energyRouter = Router();

energyRouter.get("/energy", (_request, response) => {
  response.json(energyReadings);
});

export default energyRouter;
