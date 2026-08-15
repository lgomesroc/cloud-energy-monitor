import { describe, expect, it, vi } from "vitest";
import { getEnergyReadings } from "./energy.service.js";
import * as energyRepository from "../repositories/energy.repository.js";

describe("Energy Service", () => {
  it("should return energy readings from the repository", async () => {
    const mockedReadings = [
      {
        deviceId: "device-test",
        timestamp: "2026-08-15T10:00:00Z",
        consumptionKwh: 3.5,
      },
    ];

    vi.spyOn(energyRepository, "findAllEnergyReadings").mockResolvedValue({
      readings: mockedReadings,
    });

    const result = await getEnergyReadings(10);

    expect(result.readings).toEqual(mockedReadings);
  });
});
