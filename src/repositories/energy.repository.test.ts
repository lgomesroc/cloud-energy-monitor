import { describe, expect, it } from "vitest";
import { findAllEnergyReadings } from "./energy.repository.js";

describe("Energy Repository", () => {
  it("should return energy readings with pagination", async () => {
    const result = await findAllEnergyReadings(2);

    expect(result.readings).toHaveLength(2);
    expect(result.lastEvaluatedKey).toBeDefined();
  });

  it("should return a copy of the energy readings", async () => {
    const result = await findAllEnergyReadings(2);

    expect(result.readings).toBeInstanceOf(Array);
  });
});
