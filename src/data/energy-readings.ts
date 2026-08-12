import type { EnergyReading } from "../domain/energy-reading.js";

export const energyReadings: EnergyReading[] = [
  {
    deviceId: "device-001",
    timestamp: "2026-08-12T09:00:00Z",
    consumptionKwh: 1.42,
  },
  {
    deviceId: "device-002",
    timestamp: "2026-08-12T09:05:00Z",
    consumptionKwh: 2.18,
  },
  {
    deviceId: "device-003",
    timestamp: "2026-08-12T09:10:00Z",
    consumptionKwh: 0.97,
  },
];
