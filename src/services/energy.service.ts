import type { EnergyReading } from "../domain/energy-reading.js";
import {
  findAllEnergyReadings,
  findEnergyReadingsByDevice,
} from "../repositories/energy.repository.js";

export async function getEnergyReadings(
  limit: number,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  readings: EnergyReading[];
  lastEvaluatedKey?: Record<string, unknown>;
}> {
  return findAllEnergyReadings(limit, lastEvaluatedKey);
}

export async function getEnergyReadingsByDevice(
  deviceId: string,
): Promise<EnergyReading[]> {
  return findEnergyReadingsByDevice(deviceId);
}
