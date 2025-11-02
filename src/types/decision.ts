import { Types } from "mongoose";

export type AddDecisionPayload = {
  description: string;
  decision: string;
  decisionExplanation?: string;
};

export type DecisionPublicData = {
  id: Types.ObjectId;
  userId: Types.ObjectId;
  description: string;
  decision: string;
  decisionExplanation?: string;
  estimationStatus: DecisionEstimationStatus;
};

export const DecisionEstimationStatus = {
  Unknown: "unknown",
  InProgress: "inProgress",
  Done: "done",
  Error: "error",
} as const;

export type DecisionEstimationStatus =
  (typeof DecisionEstimationStatus)[keyof typeof DecisionEstimationStatus];
