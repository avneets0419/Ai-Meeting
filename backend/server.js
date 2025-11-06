import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js";
import eventRoutes from "./routes/events.js"
import taskRoutes from "./routes/tasks.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
app.use(express.json());
app.get("/ping",(req,res)=>{
    return res.send("Server is Active")
})

// Routes
app.use("/api/users", auth);
app.use("/api/tasks", taskRoutes);
app.use("/api/events", eventRoutes);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
