import { RequestHandler } from "express";
import { Lecturer } from "@shared/types";

// In-memory storage for demo purposes
// In a real app, this would be replaced with a proper database
let lecturers: Lecturer[] = [];
let currentId = 1;

export const handleRegister: RequestHandler = (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already exists
    const existingLecturer = lecturers.find(l => l.email === email);
    if (existingLecturer) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new lecturer
    const lecturer: Lecturer = {
      id: currentId.toString(),
      name,
      email,
      password, // In a real app, this should be hashed
    };

    lecturers.push(lecturer);
    currentId++;

    res.status(201).json({
      message: "Registration successful",
      user: { id: lecturer.id, name: lecturer.name, email: lecturer.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleLogin: RequestHandler = (req, res) => {
  try {
    const { email, password } = req.body;

    // Find lecturer
    const lecturer = lecturers.find(l => l.email === email && l.password === password);
    if (!lecturer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // In a real app, generate a proper JWT token
    const token = `token-${lecturer.id}-${Date.now()}`;

    res.json({
      token,
      user: { id: lecturer.id, name: lecturer.name, email: lecturer.email }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to verify token (simplified for demo)
export const authenticateToken: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Extract user ID from token (simplified)
  const userId = token.split('-')[1];
  const lecturer = lecturers.find(l => l.id === userId);

  if (!lecturer) {
    return res.status(403).json({ message: "Invalid token" });
  }

  (req as any).user = lecturer;
  next();
};
