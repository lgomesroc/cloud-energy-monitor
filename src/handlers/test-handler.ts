import { handler } from "./energy.handler.js";

const event = {
  queryStringParameters: {
    limit: "2",
  },
} as any;

const response = await handler(event);

console.log(response);
