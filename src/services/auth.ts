import bcrypt from "bcrypt";
import ApiException from "../exceptions/api-exception";
import UserModel from "../models/user";
import { UserPublicData } from "../types/user";
import tokenService from "./token";
import { BCRYPT_SAULT } from "../constants";

class AuthService {
  async signUp(email: string, password: string, name: string) {
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      throw ApiException.BadRequestException(
        `User with the email ${email} already exists.`
      );
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SAULT);
    const user = await UserModel.create({
      email,
      password: passwordHash,
      name,
    });
    const userPublicData: UserPublicData = {
      id: user._id,
      email,
      name,
    };

    return this.completeAuth(userPublicData);
  }

  async signIn(email: string, password: string) {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw ApiException.BadRequestException("User is not found.");
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw ApiException.BadRequestException("Wrong password.");
    }

    const userPublicData: UserPublicData = {
      id: user._id,
      email,
      name: user.name,
    };

    return this.completeAuth(userPublicData);
  }

  signOut(refreshToken: string) {
    return tokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiException.UnauthorizedException();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDatabase = await tokenService.findToken(refreshToken);

    if (!userData || !tokenFromDatabase) {
      throw ApiException.UnauthorizedException();
    }

    const user = await UserModel.findById(userData.id);

    if (!user) {
      throw ApiException.NotFoundException("User is not found.");
    }

    const userPublicData: UserPublicData = {
      id: user._id,
      email: user.email,
      name: user.name,
    };

    return this.completeAuth(userPublicData);
  }

  async completeAuth(user: UserPublicData) {
    const { accessToken, refreshToken: updatedRefreshToken } =
      tokenService.generateTokens(user);

    await tokenService.saveToken(user.id, updatedRefreshToken);

    return {
      user,
      accessToken,
      refreshToken: updatedRefreshToken,
    };
  }
}

const authService = new AuthService();

export default authService;
