import { NextFunction, Request, Response } from "express";
import ApiException from "../exceptions/api-exception";
import tokenService from "../services/token";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      return next(ApiException.UnauthorizedException());
    }

    // authorization header follows the following format:
    // "Bearer <accessToken>"
    // so we need to split the header value and take the second part to get the access token
    const accessToken = authorizationHeader.split(" ")[1];

    if (!accessToken) {
      return next(ApiException.UnauthorizedException());
    }

    const userData = tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ApiException.UnauthorizedException());
    }

    req.user = userData;
    next();
  } catch {
    return next(ApiException.UnauthorizedException());
  }
};

export default authMiddleware;
