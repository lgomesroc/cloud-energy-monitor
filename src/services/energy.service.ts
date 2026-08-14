import { findAllEnergyReadings } from "../repositories/energy.repository.js";

export function getEnergyReadings() {
  return findAllEnergyReadings();
}
