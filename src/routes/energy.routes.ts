import { Router } from "express";
import { getEnergyReadings } from "../services/energy.service.js";

const energyRouter = Router();

energyRouter.get("/energy", (_request, response) => {
  response.json(getEnergyReadings());
});

export default energyRouter;
