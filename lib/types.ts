// lib/types.ts
export type ProjectCategory = "Software Suite" | "Hardware Garage" | "Sandbox";

export interface Project {
  _id: string; // Mongoose uses _id
  title: string;
  description: string;
  category: ProjectCategory;
  techStack: string[];
  desktopVideoUrl: string;
  mobileVideoUrl: string;
  liveUrl: string;
  githubUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  mediaUrl: string;
}

export interface Subscriber {
  _id: string;
  email: string;
  createdAt: string;
}

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
