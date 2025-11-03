import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import { PrismaClient } from '@prisma/client';



const router = express.Router();
const prisma = new PrismaClient();

// Check email — decides login or signup
router.post("/check-email", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.json({ exists: true, message: "User exists. Please login." });
    } else {
      return res.json({ exists: false, message: "New user. Please sign up." });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Register or login
router.post("/auth", async (req, res) => {
  const { email, password, name } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      // LOGIN
      const valid = await bcrypt.compare(password, existingUser.password);
      if (!valid) return res.status(401).json({ error: "Invalid password" });

      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({ token, user: existingUser });
    } else {
      // SIGNUP
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });

      const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.json({ token, user: newUser });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
