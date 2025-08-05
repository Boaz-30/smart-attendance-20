import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleRegister, handleLogin, authenticateToken } from "./routes/auth";
import { createSession, getLecturerSessions, getSession, getSessionByCode, toggleSessionStatus, endSession } from "./routes/sessions";
import { markAttendance, getSessionAttendance, exportAttendance } from "./routes/attendance";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/register", handleRegister);
  app.post("/api/auth/login", handleLogin);

  // Session routes (protected)
  app.post("/api/sessions", authenticateToken, createSession);
  app.get("/api/sessions", authenticateToken, getLecturerSessions);
  app.get("/api/sessions/:sessionId", authenticateToken, getSession);
  app.put("/api/sessions/:sessionId/toggle", authenticateToken, toggleSessionStatus);

  // Attendance routes
  app.get("/api/attend/:sessionCode", getSessionByCode); // Public route for students
  app.post("/api/attendance", markAttendance); // Public route for students
  app.get("/api/sessions/:sessionId/attendance", authenticateToken, getSessionAttendance);
  app.get("/api/sessions/:sessionId/export", authenticateToken, exportAttendance);

  return app;
}
