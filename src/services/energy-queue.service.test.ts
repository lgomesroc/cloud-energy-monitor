import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import {
  sendEnergyMessage,
  type EnergyMessage,
} from "./energy-queue.service.js";

describe("Energy Queue Service", () => {
  const sendMock = vi
    .spyOn(SQSClient.prototype, "send")
    .mockResolvedValue({} as never);

  beforeEach(() => {
    vi.stubEnv(
      "QUEUE_URL",
      "https://sqs.us-east-1.amazonaws.com/123456789012/energy-events",
    );

    sendMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should send an energy message to SQS", async () => {
    const message: EnergyMessage = {
      deviceId: "device-test",
      timestamp: 1755252000000,
      consumption: 3.5,
    };

    await sendEnergyMessage(message);

    expect(sendMock).toHaveBeenCalledTimes(1);

    const command = sendMock.mock.calls[0]?.[0];

    expect(command).toBeInstanceOf(SendMessageCommand);

    if (!(command instanceof SendMessageCommand)) {
      throw new Error("Expected SendMessageCommand");
    }

    expect(command.input.QueueUrl).toBe(
      "https://sqs.us-east-1.amazonaws.com/123456789012/energy-events",
    );

    expect(command.input.MessageBody).toBe(JSON.stringify(message));
  });

  it("should throw an error when QUEUE_URL is not configured", async () => {
    vi.stubEnv("QUEUE_URL", "");

    const message: EnergyMessage = {
      deviceId: "device-test",
      timestamp: 1755252000000,
      consumption: 3.5,
    };

    await expect(sendEnergyMessage(message)).rejects.toThrow(
      "QUEUE_URL não configurada.",
    );

    expect(sendMock).not.toHaveBeenCalled();
  });
});