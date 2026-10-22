// lib/models.ts
import mongoose, { Schema, models } from "mongoose";

const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    techStack: [{ type: String }],
    desktopVideoUrl: String,
    mobileVideoUrl: String,
    liveUrl: String,
    githubUrl: String,
  },
  { timestamps: true },
);

const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    mediaUrl: { type: String },
  },
  { timestamps: true },
);

const subscriberSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    mediaUrl: { type: String }, // Optional image/video for the blog
  },
  { timestamps: true },
);

const cvSchema = new Schema(
  {
    versionName: { type: String, required: true }, // e.g., "Full Stack Resume 2026"
    url: { type: String, required: true }, // Cloudinary PDF URL
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);
const journeySchema = new Schema(
  {
    kind: { type: String, enum: ["experience", "education"], required: true },
    title: { type: String, required: true },
    org: { type: String, required: true },
    period: { type: String, required: true },
    detail: { type: String, required: true },
    order: { type: Number, default: 0 }, // To control sorting order on the timeline
  },
  { timestamps: true },
);

export const Journey =
  models.Journey || mongoose.model("Journey", journeySchema);
export const CV = models.CV || mongoose.model("CV", cvSchema);
export const Post = models.Post || mongoose.model("Post", postSchema);
export const Project =
  models.Project || mongoose.model("Project", projectSchema);
export const Message =
  models.Message || mongoose.model("Message", messageSchema);
export const Subscriber =
  models.Subscriber || mongoose.model("Subscriber", subscriberSchema);
