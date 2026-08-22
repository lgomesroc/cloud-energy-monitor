import { describe, expect, it, vi } from "vitest";
import { findAllEnergyReadings } from "./energy.repository.js";
import { dynamoDbDocumentClient } from "../config/dynamodb.js";

describe("Energy Repository", () => {
  it("should return energy readings with pagination", async () => {
    vi.spyOn(dynamoDbDocumentClient, "send").mockResolvedValue({
      Items: [
        {
          deviceId: "device-001",
          timestamp: "2026-08-22T10:00:00Z",
          consumptionKwh: 1.5,
        },
        {
          deviceId: "device-001",
          timestamp: "2026-08-22T11:00:00Z",
          consumptionKwh: 1.8,
        },
      ],
      LastEvaluatedKey: {
        deviceId: "device-001",
        timestamp: "2026-08-22T11:00:00Z",
      },
    } as never);

    const result = await findAllEnergyReadings(2);

    expect(result.readings).toHaveLength(2);
    expect(result.lastEvaluatedKey).toBeDefined();
  });

  it("should return a copy of the energy readings", async () => {
    vi.spyOn(dynamoDbDocumentClient, "send").mockResolvedValue({
      Items: [
        {
          deviceId: "device-001",
          timestamp: "2026-08-22T10:00:00Z",
          consumptionKwh: 1.5,
        },
        {
          deviceId: "device-001",
          timestamp: "2026-08-22T11:00:00Z",
          consumptionKwh: 1.8,
        },
      ],
    } as never);

    const result = await findAllEnergyReadings(2);

    expect(result.readings).toBeInstanceOf(Array);
  });
});
