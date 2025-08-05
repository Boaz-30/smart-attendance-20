import { RequestHandler } from "express";
import { ClassSession, CreateSessionRequest } from "@shared/types";

// In-memory storage for demo purposes
let sessions: ClassSession[] = [];
let currentSessionId = 1;

const generateSessionCode = (): string => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const createSession: RequestHandler = (req, res) => {
  try {
    const { title, courseName, datetime, location, radius }: CreateSessionRequest = req.body;
    const lecturer = (req as any).user;

    const sessionCode = generateSessionCode();
    const session: ClassSession = {
      id: currentSessionId.toString(),
      lecturerId: lecturer.id,
      title,
      courseName,
      datetime,
      location,
      radius,
      sessionCode,
      qrCode: `${process.env.BASE_URL || 'http://localhost:8080'}/attend/${sessionCode}`,
      isActive: true,
    };

    sessions.push(session);
    currentSessionId++;

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to create session" });
  }
};

export const getLecturerSessions: RequestHandler = (req, res) => {
  try {
    const lecturer = (req as any).user;
    const lecturerSessions = sessions.filter(s => s.lecturerId === lecturer.id);
    
    // Sort by datetime, newest first
    lecturerSessions.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
    
    res.json(lecturerSessions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch sessions" });
  }
};

export const getSession: RequestHandler = (req, res) => {
  try {
    const { sessionId } = req.params;
    const lecturer = (req as any).user;

    const session = sessions.find(s => s.id === sessionId && s.lecturerId === lecturer.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session" });
  }
};

export const getSessionByCode: RequestHandler = (req, res) => {
  try {
    const { sessionCode } = req.params;
    const session = sessions.find(s => s.sessionCode === sessionCode);
    
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Return only public information for students
    res.json({
      id: session.id,
      title: session.title,
      courseName: session.courseName,
      datetime: session.datetime,
      location: session.location,
      radius: session.radius,
      sessionCode: session.sessionCode,
      isActive: session.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch session" });
  }
};

export const toggleSessionStatus: RequestHandler = (req, res) => {
  try {
    const { sessionId } = req.params;
    const lecturer = (req as any).user;

    const session = sessions.find(s => s.id === sessionId && s.lecturerId === lecturer.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.isActive = !session.isActive;
    res.json(session);
  } catch (error) {
    res.status(500).json({ message: "Failed to update session status" });
  }
};
