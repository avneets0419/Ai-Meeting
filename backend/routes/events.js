import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();
const prisma = new PrismaClient();

// 🟢 GET all events for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      where: { userId: req.user.id },
      orderBy: { start: "asc" },
    });
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events" });
  }
});


router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, start, end, allDay, color, location } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
        allDay: allDay || false,
        color,
        location,
        userId: req.user.id,
      },
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});


router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, start, end, allDay, color, location } = req.body;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: { title, description, start, end, allDay, color, location }
    });
    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update event" });
  }
});


router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({ where: { id } });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

export default router;
