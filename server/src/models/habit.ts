import mongoose from "mongoose";

const completionSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "Productivity",
    },
    frequency: {
      type: String,
      default: "Daily",
    },
    difficulty: {
      type: String,
      default: "Easy",
    },
    reminderTime: {
      type: String,
      default: "",
    },
    completions: [completionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Habit", habitSchema);