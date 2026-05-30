import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { connectDB } from "./config/db";
import aiRoutes from "./routes/aiRoutes";
import habitRoutes from "./routes/habitRoutes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("HabitIQ API is running");
});
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});