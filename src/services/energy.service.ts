import type { EnergyReading } from "../domain/energy-reading.js";
import { findAllEnergyReadings } from "../repositories/energy.repository.js";

export function getEnergyReadings(): EnergyReading[] {
  return findAllEnergyReadings();
}
