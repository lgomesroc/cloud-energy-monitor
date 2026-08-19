import { handler } from "./energy.handler.js";

const listEvent = {
  queryStringParameters: {
    limit: "2",
  },
} as any;

const listResponse = await handler(listEvent);

console.log("=== GET /api/energy ===");
console.log("Status:", listResponse.statusCode);
console.log("Body:", JSON.parse(listResponse.body));

const deviceEvent = {
  pathParameters: {
    deviceId: "device-002",
  },
} as any;

const deviceResponse = await handler(deviceEvent);

console.log("\n=== GET /api/energy/device-002 ===");
console.log("Status:", deviceResponse.statusCode);
console.log("Body:", JSON.parse(deviceResponse.body));
