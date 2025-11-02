import jwt from "jsonwebtoken";
import { UserPublicData } from "../types/user";
import TokenModel from "../models/token";
import { Types } from "mongoose";

const JWT_ACCESS_EXPIRES_IN = "30m";
const JWT_REFRESH_EXPIRES_IN = "30d";

class TokenService {
  generateTokens(userData: UserPublicData) {
    const accessToken = jwt.sign(
      userData,
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: JWT_ACCESS_EXPIRES_IN,
      }
    );
    const refreshToken = jwt.sign(
      userData,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
      }
    );

    return { accessToken, refreshToken };
  }

  async saveToken(userId: Types.ObjectId, refreshToken: string) {
    const existingToken = await TokenModel.findOne({ user: userId });

    if (existingToken) {
      existingToken.refreshToken = refreshToken;

      return existingToken.save();
    }

    const token = await TokenModel.create({ user: userId, refreshToken });

    return token;
  }

  validateAccessToken(accessToken: string) {
    try {
      const userData = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET as string
      ) as UserPublicData;

      return userData;
    } catch {
      return null;
    }
  }

  validateRefreshToken(refreshToken: string) {
    try {
      const userData = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as UserPublicData;

      return userData;
    } catch {
      return null;
    }
  }

  findToken(refreshToken: string) {
    return TokenModel.findOne({ refreshToken });
  }

  removeToken(refreshToken: string) {
    return TokenModel.deleteOne({ refreshToken });
  }
}

const tokenService = new TokenService();

export default tokenService;
