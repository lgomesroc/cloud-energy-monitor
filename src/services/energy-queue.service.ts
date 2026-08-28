import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({
  region: process.env.AWS_REGION ?? "us-east-1",
});

export interface EnergyMessage {
  deviceId: string;
  timestamp: number;
  consumption: number;
}

export async function sendEnergyMessage(
  message: EnergyMessage,
): Promise<void> {
  const queueUrl = process.env.QUEUE_URL;

  if (!queueUrl) {
    throw new Error("QUEUE_URL não configurada.");
  }

  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: JSON.stringify(message),
  });

  await sqsClient.send(command);
}