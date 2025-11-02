import { UserPublicData } from "./user";

declare global {
  namespace Express {
    interface Request {
      user?: UserPublicData;
    }
  }
}
