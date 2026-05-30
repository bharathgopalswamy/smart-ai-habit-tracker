import mongoose from "mongoose";

const aiPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {
      type: String,
      required: true,
    },
    focus: String,
    duration: String,
    intensity: String,
    plan: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("AIPlan", aiPlanSchema);