import express from "express";

const app = express();
const port = 3000;

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    application: "Cloud Energy Monitor",
  });
});

app.listen(port, () => {
  console.log(`Cloud Energy Monitor running on port ${port}`);
});