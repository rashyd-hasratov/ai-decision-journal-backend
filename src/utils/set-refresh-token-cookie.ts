import { Response } from "express";
import { REFRESH_TOKEN_MAX_AGE_MS } from "../constants";

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, {
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
    httpOnly: true,
  });
};

export default setRefreshTokenCookie;
