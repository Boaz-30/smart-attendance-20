import { ClassSession } from "@shared/types";

// Shared sessions array that can be imported by other modules
export let sessions: ClassSession[] = [];
export let currentSessionId = 1;

export const addSession = (session: ClassSession) => {
  sessions.push(session);
};

export const getSessionById = (id: string) => {
  return sessions.find(s => s.id === id);
};

export const getSessionByCode = (code: string) => {
  return sessions.find(s => s.sessionCode === code);
};
