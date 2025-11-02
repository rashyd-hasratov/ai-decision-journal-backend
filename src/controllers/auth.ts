import { NextFunction, Request, Response } from "express";
import { UserFullData } from "../types/user";
import authService from "../services/auth";
import { validationResult } from "express-validator";
import ApiException from "../exceptions/api-exception";
import { SignInPayload, SignUpPayload } from "../types/auth";
import { REFRESH_TOKEN_MAX_AGE_MS } from "../constants";
import validateRequest from "../utils/validate-request";
import setRefreshTokenCookie from "../utils/set-refresh-token-cookie";

class AuthController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequest(req, next);

      const { email, password, name } = req.body as SignUpPayload;
      const userData = await authService.signUp(email, password, name);

      setRefreshTokenCookie(res, userData.refreshToken);

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      validateRequest(req, next);

      const { email, password } = req.body as SignInPayload;
      const userData = await authService.signIn(email, password);

      setRefreshTokenCookie(res, userData.refreshToken);

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      await authService.signOut(refreshToken);
      res.clearCookie("refreshToken");

      return res.sendStatus(200);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;

      const userData = await authService.refresh(refreshToken);

      setRefreshTokenCookie(res, userData.refreshToken);

      return res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

const authController = new AuthController();

export default authController;
