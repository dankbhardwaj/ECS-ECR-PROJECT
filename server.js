const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

// Simple request logging (goes to stdout -> CloudWatch)
app.use((req, res, next) => {
  console.log(JSON.stringify({
    time: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    ip: req.ip
  }));
  next();
});

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Health & sample APIs
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from ECS Fargate ✨" });
});

// Fallback to index
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Graceful shutdown signals (Fargate)
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server listening on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Closing server...`);
  server.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
  // Force-exit after 10s
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
