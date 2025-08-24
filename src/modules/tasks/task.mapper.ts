import { TaskEntity } from "./entities/task.entity";

export type Task = {
  id: string;
  userId: string;
  coupleId: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  category: "work" | "personal" | "appointment" | "other";
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export const mapTask = (e: TaskEntity): Task => ({
  id: e._id?.toString(),
  userId: e.userId,
  coupleId: e.coupleId,
  title: e.title,
  description: e.description,
  date: e.date,
  time: e.time,
  category: e.category,
  done: !!e.done,
  createdAt: e.createdAt?.toISOString?.() ?? String(e.createdAt),
  updatedAt: e.updatedAt?.toISOString?.() ?? String(e.updatedAt),
});
