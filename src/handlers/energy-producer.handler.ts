import type {
    APIGatewayProxyEvent,
    APIGatewayProxyResult,
  } from "aws-lambda";
  
  import {
    sendEnergyMessage,
    type EnergyMessage,
  } from "../services/energy-queue.service.js";
  
  export async function handler(
    event: APIGatewayProxyEvent,
  ): Promise<APIGatewayProxyResult> {
    try {
      if (!event.body) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "O corpo da requisição é obrigatório.",
          }),
        };
      }
  
      let body: unknown;
  
      try {
        body = JSON.parse(event.body);
      } catch {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "O corpo da requisição deve ser um JSON válido.",
          }),
        };
      }
  
      if (
        typeof body !== "object" ||
        body === null ||
        Array.isArray(body)
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "O corpo da requisição deve ser um objeto JSON.",
          }),
        };
      }
  
      const data = body as Record<string, unknown>;
  
      const { deviceId, timestamp, consumption } = data;
  
      if (
        typeof deviceId !== "string" ||
        deviceId.trim() === ""
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "deviceId é obrigatório.",
          }),
        };
      }
  
      if (
        typeof timestamp !== "number" ||
        !Number.isFinite(timestamp)
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "timestamp deve ser um número válido.",
          }),
        };
      }
  
      if (
        typeof consumption !== "number" ||
        !Number.isFinite(consumption) ||
        consumption < 0
      ) {
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: "consumption deve ser um número maior ou igual a zero.",
          }),
        };
      }
  
      const message: EnergyMessage = {
        deviceId,
        timestamp,
        consumption,
      };
  
      await sendEnergyMessage(message);
  
      return {
        statusCode: 202,
        body: JSON.stringify({
          message: "Leitura de energia enviada para processamento.",
        }),
      };
    } catch (error) {
      console.error(
        "Erro ao enviar leitura de energia para a fila:",
        error,
      );
  
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Erro interno do servidor.",
        }),
      };
    }
  }