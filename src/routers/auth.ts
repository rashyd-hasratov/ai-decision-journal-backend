import { Router } from "express";
import authController from "../controllers/auth";
import { body } from "express-validator";
import PATHS from "../constants/paths";

const authRouter = Router();

authRouter.post(
  PATHS.SIGN_UP,
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isString(),
  body("name").notEmpty().isString(),
  authController.signUp
);
authRouter.post(
  PATHS.SIGN_IN,
  body("email").notEmpty().isEmail(),
  body("password").notEmpty().isString(),
  authController.signIn
);
authRouter.post(PATHS.SIGN_OUT, authController.signOut);
authRouter.post(PATHS.REFRESH, authController.refresh);

export default authRouter;
