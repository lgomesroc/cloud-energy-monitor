import express from "express";
import energyRouter from "./routes/energy.routes.js";

const app = express();

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    application: "Cloud Energy Monitor",
  });
});

app.use("/api", energyRouter);

export default app;
