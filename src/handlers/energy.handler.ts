import type {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from "aws-lambda";

import {
  getEnergyReadings,
  getEnergyReadingsByDevice,
} from "../services/energy.service.js";

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const deviceId = event.pathParameters?.deviceId;

    if (deviceId) {
      const readings = await getEnergyReadingsByDevice(deviceId);

      return {
        statusCode: 200,
        body: JSON.stringify({
          readings,
        }),
      };
    }

    const limit = Number(event.queryStringParameters?.limit ?? 2);

    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "O parâmetro limit deve ser um número inteiro entre 1 e 100.",
        }),
      };
    }

    let lastKey: Record<string, unknown> | undefined;

    const encodedLastKey = event.queryStringParameters?.lastKey;

    if (encodedLastKey) {
      try {
        const decodedLastKey = Buffer.from(
          encodedLastKey,
          "base64",
        ).toString("utf-8");

        const parsedLastKey: unknown = JSON.parse(decodedLastKey);

        if (
          typeof parsedLastKey !== "object" ||
          parsedLastKey === null ||
          Array.isArray(parsedLastKey)
        ) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              error: "O parâmetro lastKey é inválido.",
            }),
          };
        }

        lastKey = parsedLastKey as Record<string, unknown>;
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "O parâmetro lastKey é inválido.",
          }),
        };
      }
    }

    const result = await getEnergyReadings(limit, lastKey);

    const responseLastKey = result.lastEvaluatedKey
      ? Buffer.from(
          JSON.stringify(result.lastEvaluatedKey),
        ).toString("base64")
      : undefined;

    return {
      statusCode: 200,
      body: JSON.stringify({
        readings: result.readings,
        ...(responseLastKey
          ? { lastKey: responseLastKey }
          : {}),
      }),
    };
  } catch (error) {
    console.error("Erro ao buscar leituras de energia:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro interno do servidor.",
      }),
    };
  }
}
  