import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoDbDocumentClient } from "./dynamodb.js";

const command = new ScanCommand({
  TableName: "CloudEnergyReadings",
});

const result = await dynamoDbDocumentClient.send(command);

console.log("Leituras encontradas:");
console.log(result.Items);
