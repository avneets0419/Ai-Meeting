import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';
import passport from "passport";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const prisma = new PrismaClient();


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const gUser = req.user;

      let existing = await prisma.user.findFirst({
        where: { googleId: gUser.googleId },
      });

      if (!existing) {
        existing = await prisma.user.create({
          data: {
            googleId: gUser.googleId,
            name: gUser.name,
            email: gUser.email,
            avatar: gUser.photo,
          },
        });
      }

      const token = jwt.sign(
        { id: existing.id, email: existing.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.redirect(
        `${process.env.FRONTEND_URL}/auth/callback?token=${token}`
      );
    } catch (err) {
      console.error("Google login error:", err);
      res.status(500).json({ error: "Google login failed" });
    }
  }
);

// ---------------------- CHECK EMAIL ----------------------
router.post("/check-email", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ exists: false });

    const isGoogleUser = !!user.googleId;
    return res.json({
      exists: true,
      googleUser: isGoogleUser,
      message: isGoogleUser
        ? "Google account found. Continue with Google."
        : "User exists. Please login.",
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------- EMAIL LOGIN/SIGNUP ----------------------
router.post("/auth", async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    // ---------------------- LOGIN ----------------------
    if (existingUser) {
      if (existingUser.googleId) {
        return res.status(400).json({
          error: "This email is registered with Google. Continue with Google login.",
        });
      }

      const valid = await bcrypt.compare(password, existingUser.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

      const token = jwt.sign(
        { id: existingUser.id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({ token, user: existingUser });
    }

    // ---------------------- SIGNUP ----------------------
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user: newUser });
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ---------------------- ME ROUTE ----------------------
router.get("/me", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = tokenHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
router.put("/update", async (req, res) => {
  try {
    const tokenHeader = req.headers.authorization;
    if (!tokenHeader)
      return res.status(401).json({ error: "No token provided" });

    const token = tokenHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    const { name, avatar } = req.body;

    if (!name && !avatar) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
      },
    });

    res.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
