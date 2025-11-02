import { Types } from "mongoose";
import ApiException from "../exceptions/api-exception";
import DecisionModel from "../models/decision";
import UserModel from "../models/user";
import {
  DecisionEstimationStatus,
  DecisionPublicData,
} from "../types/decision";
import estimationService from "./estimation";

class DecisionService {
  async add(
    userId: Types.ObjectId,
    description: string,
    decision: string,
    decisionExplanation?: string
  ) {
    const existingUser = await UserModel.findById(userId);

    if (!existingUser) {
      throw ApiException.NotFoundException("User is not found.");
    }

    const decisionRecord = await DecisionModel.create({
      userId,
      description,
      decision,
      decisionExplanation,
    });

    const decisionPublicData: DecisionPublicData = {
      id: decisionRecord._id,
      userId,
      description,
      decision,
      decisionExplanation,
      estimationStatus:
        decisionRecord.estimationStatus as DecisionEstimationStatus,
    };

    estimationService.estimate(decisionPublicData);

    return decisionPublicData;
  }

  async updateStatus(
    decisionId: Types.ObjectId,
    status: DecisionEstimationStatus
  ) {
    const decision = await DecisionModel.findById(decisionId);

    if (!decision) {
      console.error(
        `Failed to update decision estimation status. Decision with id ${decisionId} is not found.`
      );

      return;
    }

    decision.estimationStatus = status;
    await decision.save();
  }

  async getAll(userId: Types.ObjectId) {
    return DecisionModel.find({ userId })
      .populate({
        path: "estimation",
        transform: (doc) =>
          doc && {
            decisionCategory: doc.decisionCategory,
            potentialCognitiveBiases: JSON.parse(
              doc.potentialCognitiveBiases ?? "[]"
            ),
            alternatives: JSON.parse(doc.alternatives ?? "[]"),
          },
      })
      .lean();
  }
}

const decisionService = new DecisionService();

export default decisionService;
