import {
    CreateTableCommand,
    DescribeTableCommand,
  } from "@aws-sdk/client-dynamodb";
  import { dynamoDbDocumentClient } from "./dynamodb.js";
  
  const tableName = "CloudEnergyReadings";
  
  async function createTable(): Promise<void> {
    try {
      await dynamoDbDocumentClient.send(
        new CreateTableCommand({
          TableName: tableName,
          KeySchema: [
            {
              AttributeName: "deviceId",
              KeyType: "HASH",
            },
            {
              AttributeName: "timestamp",
              KeyType: "RANGE",
            },
          ],
          AttributeDefinitions: [
            {
              AttributeName: "deviceId",
              AttributeType: "S",
            },
            {
              AttributeName: "timestamp",
              AttributeType: "S",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
        }),
      );
  
      console.log(`Tabela ${tableName} criada com sucesso.`);
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "ResourceInUseException"
      ) {
        console.log(`Tabela ${tableName} já existe.`);
        return;
      }
  
      throw error;
    }
  }
  
  async function checkTable(): Promise<void> {
    try {
      const result = await dynamoDbDocumentClient.send(
        new DescribeTableCommand({
          TableName: tableName,
        }),
      );
  
      console.log("Status da tabela:", result.Table?.TableStatus);
    } catch (error) {
      console.error("Erro ao consultar tabela:", error);
    }
  }
  
  await createTable();
  await checkTable();
  