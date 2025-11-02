import { Types } from "mongoose";

export type UserFullData = {
  email: string;
  password: string;
  name: string;
};

export type UserPublicData = Omit<UserFullData, "password"> & {
  id: Types.ObjectId;
};
