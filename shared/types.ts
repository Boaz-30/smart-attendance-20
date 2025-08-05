export interface Lecturer {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface Student {
  id: string;
  name: string;
  indexNumber: string;
}

export interface ClassSession {
  id: string;
  lecturerId: string;
  title: string;
  courseName: string;
  datetime: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  radius: number; // in meters
  sessionCode: string;
  qrCode: string;
  isActive: boolean;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  studentName: string;
  indexNumber: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
  };
  isValid: boolean;
}

export interface CreateSessionRequest {
  title: string;
  courseName: string;
  datetime: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  radius: number;
}

export interface AttendanceRequest {
  sessionCode: string;
  studentName: string;
  indexNumber: string;
  location: {
    latitude: number;
    longitude: number;
  };
}
