import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ApiException from "../exceptions/api-exception";
import { AddDecisionPayload } from "../types/decision";
import decisionService from "../services/decision";

class DecisionController {
  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        next(
          ApiException.BadRequestException("Validation error.", errors.array())
        );
      }

      const { description, decision, decisionExplanation } =
        req.body as AddDecisionPayload;
      const decisionData = await decisionService.add(
        req.user!.id,
        description,
        decision,
        decisionExplanation
      );

      return res.json(decisionData);
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const decisions = await decisionService.getAll(req.user!.id);

      return res.json(decisions);
    } catch (error) {
      next(error);
    }
  }
}

const decisionController = new DecisionController();

export default decisionController;
