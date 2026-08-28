import type { SQSEvent } from "aws-lambda";

export const handler = async (event: SQSEvent): Promise<void> => {
  console.log(
    `Iniciando processamento de ${event.Records.length} mensagem(ns) da fila`,
  );

  for (const record of event.Records) {
    try {
      console.log("Mensagem recebida para processamento");

      const message = JSON.parse(record.body);

      if (
        typeof message !== "object" ||
        message === null ||
        Array.isArray(message)
      ) {
        throw new Error("Mensagem inválida recebida da fila.");
      }

      const { deviceId } = message;

      if (
        typeof deviceId !== "string" ||
        deviceId.trim() === ""
      ) {
        throw new Error("deviceId ausente ou inválido na mensagem.");
      }

      console.log(
        "Processando leitura do dispositivo:",
        deviceId,
      );

      console.log(
        "Mensagem processada com sucesso",
      );
    } catch (error) {
      console.error(
        "Erro ao processar mensagem da fila:",
        error,
      );

      throw error;
    }
  }

  console.log("Processamento das mensagens concluído");
};
