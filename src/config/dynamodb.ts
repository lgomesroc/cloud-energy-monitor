import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION ?? "sa-east-1",
  endpoint: process.env.DYNAMODB_ENDPOINT ?? "http://localhost:8000",
});

export const dynamoDbDocumentClient =
  DynamoDBDocumentClient.from(dynamoDbClient);
