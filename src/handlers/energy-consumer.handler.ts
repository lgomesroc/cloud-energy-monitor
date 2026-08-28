import type { SQSEvent } from 'aws-lambda';

export const handler = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    console.log('Mensagem recebida:', record.body);
  }
};