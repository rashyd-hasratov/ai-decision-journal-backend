import { Router } from "express";
import PATHS from "../constants/paths";
import { body } from "express-validator";
import decisionController from "../controllers/decision";
import authMiddleware from "../middlewares/auth";

const decisionRouter = Router();

decisionRouter.post(
  PATHS.ADD_DECISION,
  authMiddleware,
  body("description").notEmpty().isString(),
  body("decision").notEmpty().isString(),
  body("decisionExplanation").optional().isString(),
  decisionController.add
);

decisionRouter.get("/", authMiddleware, decisionController.getAll);

export default decisionRouter;
