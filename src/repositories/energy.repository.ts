import { QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { EnergyReading } from "../domain/energy-reading.js";
import { dynamoDbDocumentClient } from "../config/dynamodb.js";

const tableName = "CloudEnergyReadings";

export async function findAllEnergyReadings(
  limit: number,
  lastEvaluatedKey?: Record<string, unknown>,
): Promise<{
  readings: EnergyReading[];
  lastEvaluatedKey?: Record<string, unknown>;
}> {
  const command = new ScanCommand({
    TableName: tableName,
    Limit: limit,
    ExclusiveStartKey: lastEvaluatedKey,
  });

  let result;

  try {
    result = await dynamoDbDocumentClient.send(command);
  } catch (error) {
    console.error("Erro ao acessar o DynamoDB:", error);
    throw error;
  }

  const response: {
    readings: EnergyReading[];
    lastEvaluatedKey?: Record<string, unknown>;
  } = {
    readings: (result.Items ?? []) as EnergyReading[],
  };

  if (result.LastEvaluatedKey) {
    response.lastEvaluatedKey = result.LastEvaluatedKey;
  }

  return response;
}

export async function findEnergyReadingsByDevice(
  deviceId: string,
): Promise<EnergyReading[]> {
  const command = new QueryCommand({
    TableName: tableName,
    KeyConditionExpression: "deviceId = :deviceId",
    ExpressionAttributeValues: {
      ":deviceId": deviceId,
    },
  });

  const result = await dynamoDbDocumentClient.send(command);

  return (result.Items ?? []) as EnergyReading[];
}
