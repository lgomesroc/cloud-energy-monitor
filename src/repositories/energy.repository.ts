import type { EnergyReading } from "../domain/energy-reading.js";
import { energyReadings } from "../data/energy-readings.js";

export function findAllEnergyReadings(): EnergyReading[] {
  return [...energyReadings];
}
