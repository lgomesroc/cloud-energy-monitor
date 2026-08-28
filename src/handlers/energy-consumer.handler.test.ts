import { describe, expect, it, vi } from 'vitest';
import type { SQSEvent } from 'aws-lambda';
import { handler } from './energy-consumer.handler.js';

describe('Energy Consumer Handler', () => {
  it('deve processar mensagens recebidas do SQS', async () => {
    const consoleLogSpy = vi
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    const messageBody = JSON.stringify({
      deviceId: 'device-001',
      consumption: 15.7,
      timestamp: 1700000000000,
    });

    const event: SQSEvent = {
      Records: [
        {
          messageId: 'message-1',
          receiptHandle: 'receipt-handle-1',
          body: messageBody,
          attributes: {
            ApproximateReceiveCount: '1',
            SentTimestamp: '1700000000000',
            SenderId: 'sender-1',
            ApproximateFirstReceiveTimestamp: '1700000000000',
          },
          messageAttributes: {},
          md5OfBody: 'md5',
          eventSource: 'aws:sqs',
          eventSourceARN:
            'arn:aws:sqs:us-east-1:123456789012:cloud-energy-monitor-queue',
          awsRegion: 'us-east-1',
        },
      ],
    };

    await handler(event);

    expect(consoleLogSpy).toHaveBeenCalledWith(
      'Mensagem recebida:',
      messageBody,
    );

    consoleLogSpy.mockRestore();
  });
});