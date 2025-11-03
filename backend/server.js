import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import auth from "./routes/auth.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin: "*", // or "http://localhost:3000" if you want to restrict it
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }));
app.use(express.json());
app.get("/test",(req,res)=>{
    console.log("test")
    try{ return res.status(200).json({"test":"get"})}
    catch(err){
        console.log(err)
    }
   
})

// Routes
app.use("/api/users", auth);


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
