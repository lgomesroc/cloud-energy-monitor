import express from "express";

const app = express();

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    application: "Cloud Energy Monitor",
  });
});

export default app;