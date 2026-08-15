import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbDocumentClient } from "./dynamodb.js";
import type { EnergyReading } from "../domain/energy-reading.js";

const readings: EnergyReading[] = [
  {
    deviceId: "device-002",
    timestamp: "2026-08-15T12:05:00Z",
    consumptionKwh: 2.18,
  },
  {
    deviceId: "device-003",
    timestamp: "2026-08-15T12:10:00Z",
    consumptionKwh: 0.97,
  },
];

for (const reading of readings) {
  const command = new PutCommand({
    TableName: "CloudEnergyReadings",
    Item: reading,
  });

  await dynamoDbDocumentClient.send(command);

  console.log(`Leitura inserida: ${reading.deviceId}`);
}
