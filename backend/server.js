import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js";
import taskRoutes from "./routes/tasks.js";
import transcribeRoutes from "./routes/transcribe.js";
import session from "express-session";
import passport from "./config/passport.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/ping", (req, res) => res.send("Server is Active"));

// ROUTES
app.use("/api/transcribe", transcribeRoutes);
app.use("/api/users", authRoutes);   // <--- IMPORTANT
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
