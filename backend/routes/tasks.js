import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

/**
 * 🟢 Get all tasks for logged-in user
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { ownerId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    // Count summary for dashboard cards
    const counts = {
      todo: tasks.filter((t) => t.status === "todo").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    };

    res.json({ tasks, counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

/**
 * 🟡 Create a new task
 */
router.post("/", authMiddleware, async (req, res) => {
  const { title, description, status, startAt, endAt } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        status: status || "todo",
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        ownerId: req.user.id,
      },
    });
    res.json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

/**
 * 🟠 Update a task
 */
router.put("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
  
    try {
      const updatedTask = await prisma.task.update({
        where: { id },
        data: { title, description, status, startAt, endAt },
      });
      res.json(updatedTask);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update task" });
    }
  });
  

/**
 * 🔴 Delete a task
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id } });
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;
