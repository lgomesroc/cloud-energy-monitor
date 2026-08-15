import {
    QueryCommand,
  } from "@aws-sdk/lib-dynamodb";
  import { dynamoDbDocumentClient } from "./dynamodb.js";
  
  const command = new QueryCommand({
    TableName: "CloudEnergyReadings",
    KeyConditionExpression: "deviceId = :deviceId",
    ExpressionAttributeValues: {
      ":deviceId": "device-001",
    },
  });
  
  const result = await dynamoDbDocumentClient.send(command);
  
  console.log("Leituras do device-001:");
  console.log(result.Items);
  