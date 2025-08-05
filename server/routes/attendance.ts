import { RequestHandler } from "express";
import { AttendanceRecord, AttendanceRequest } from "@shared/types";

// In-memory storage for demo purposes
let attendanceRecords: AttendanceRecord[] = [];
let currentAttendanceId = 1;

// Import sessions from sessions module (in a real app, this would be from database)
import { sessions } from "./sessions-data";

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

export const markAttendance: RequestHandler = (req, res) => {
  try {
    const { sessionCode, studentName, indexNumber, location }: AttendanceRequest = req.body;

    // Find the session
    const session = sessions.find(s => s.sessionCode === sessionCode);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (!session.isActive) {
      return res.status(400).json({ message: "Session is not active" });
    }

    // Check if student already marked attendance for this session
    const existingRecord = attendanceRecords.find(
      r => r.sessionId === session.id && r.indexNumber === indexNumber
    );
    
    if (existingRecord) {
      return res.status(400).json({ message: "Attendance already marked for this session" });
    }

    // Calculate distance from class location
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      session.location.latitude,
      session.location.longitude
    );

    const isValid = distance <= session.radius;

    // Create attendance record
    const attendanceRecord: AttendanceRecord = {
      id: currentAttendanceId.toString(),
      sessionId: session.id,
      studentName,
      indexNumber,
      timestamp: new Date().toISOString(),
      location,
      isValid,
    };

    attendanceRecords.push(attendanceRecord);
    currentAttendanceId++;

    res.status(201).json({
      message: "Attendance marked successfully",
      record: attendanceRecord,
      distance: Math.round(distance),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

export const getSessionAttendance: RequestHandler = (req, res) => {
  try {
    const { sessionId } = req.params;
    const lecturer = (req as any).user;

    // Verify session belongs to lecturer
    const session = sessions.find(s => s.id === sessionId && s.lecturerId === lecturer.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const sessionAttendance = attendanceRecords.filter(r => r.sessionId === sessionId);
    
    // Sort by timestamp, newest first
    sessionAttendance.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json(sessionAttendance);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch attendance" });
  }
};

export const exportAttendance: RequestHandler = (req, res) => {
  try {
    const { sessionId } = req.params;
    const lecturer = (req as any).user;

    // Verify session belongs to lecturer
    const session = sessions.find(s => s.id === sessionId && s.lecturerId === lecturer.id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const sessionAttendance = attendanceRecords.filter(r => r.sessionId === sessionId);
    
    // Create CSV content
    const csvHeader = "Student Name,Index Number,Timestamp,Status,Latitude,Longitude\n";
    const csvRows = sessionAttendance.map(record => 
      `"${record.studentName}","${record.indexNumber}","${record.timestamp}","${record.isValid ? 'Valid' : 'Invalid'}",${record.location.latitude},${record.location.longitude}`
    ).join('\n');

    const csvContent = csvHeader + csvRows;

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance-${session.title}-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: "Failed to export attendance" });
  }
};
