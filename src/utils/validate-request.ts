import { NextFunction, Request } from "express";
import { validationResult } from "express-validator";
import ApiException from "../exceptions/api-exception";

const validateRequest = (req: Request, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    next(ApiException.BadRequestException("Validation error.", errors.array()));
  }
};

export default validateRequest;
