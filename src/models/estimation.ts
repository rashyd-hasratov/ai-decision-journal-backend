import { model, Schema, Types } from "mongoose";

const EstimationSchema = new Schema({
  decisionId: { type: Types.ObjectId, required: true, ref: "Decision" },
  decisionCategory: { type: String, required: true },
  potentialCognitiveBiases: { type: String, required: true },
  alternatives: { type: String, required: true },
});

const EstimationModel = model("Estimation", EstimationSchema);

export default EstimationModel;
