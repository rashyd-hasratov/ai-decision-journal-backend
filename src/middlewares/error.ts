import { NextFunction, Request, Response } from "express";
import ApiException from "../exceptions/api-exception";

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ApiException) {
    return res
      .status(error.status)
      .json({ message: error.message, errors: error.errors });
  }

  return res.status(500).json({ message: "Unknown server error." });
};

export default errorMiddleware;
