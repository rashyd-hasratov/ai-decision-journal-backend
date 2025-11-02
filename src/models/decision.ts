import { model, Schema, Types } from "mongoose";
import { DecisionEstimationStatus } from "../types/decision";

const DecisionSchema = new Schema({
  userId: { type: Types.ObjectId, required: true },
  description: { type: String, required: true },
  decision: { type: String, required: true },
  decisionExplanation: { type: String },
  estimationStatus: {
    type: String,
    default: DecisionEstimationStatus.InProgress,
  },
});

DecisionSchema.virtual("estimation", {
  ref: "Estimation",
  localField: "_id",
  foreignField: "decisionId",
  justOne: true,
});

DecisionSchema.set("toObject", { virtuals: true });
DecisionSchema.set("toJSON", { virtuals: true });

const DecisionModel = model("Decision", DecisionSchema);

export default DecisionModel;
