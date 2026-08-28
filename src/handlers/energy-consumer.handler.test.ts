import type { SQSEvent } from "aws-lambda";
import { describe, expect, it, vi } from "vitest";

import { handler } from "./energy-consumer.handler.js";

describe("Energy Consumer Handler", () => {
  it("deve processar mensagens recebidas do SQS", async () => {
    const messageBody = JSON.stringify({
      deviceId: "device-001",
      consumption: 15.7,
      timestamp: 1700000000000,
    });

    const event: SQSEvent = {
      Records: [
        {
          messageId: "message-001",
          receiptHandle: "receipt-handle",
          body: messageBody,
          attributes: {
            ApproximateReceiveCount: "1",
            SentTimestamp: "1700000000000",
            SenderId: "sender",
            ApproximateFirstReceiveTimestamp: "1700000000000",
          },
          messageAttributes: {},
          md5OfBody: "md5",
          eventSource: "aws:sqs",
          eventSourceARN:
            "arn:aws:sqs:us-east-1:123456789012:energy-queue",
          awsRegion: "us-east-1",
        },
      ],
    };

    const consoleLogSpy = vi
      .spyOn(console, "log")
      .mockImplementation(() => {});

    await handler(event);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Iniciando processamento de 1 mensagem(ns) da fila",
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Mensagem recebida para processamento",
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Processando leitura do dispositivo:",
      "device-001",
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Mensagem processada com sucesso",
    );

    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Processamento das mensagens concluído",
    );

    consoleLogSpy.mockRestore();
  });
});
