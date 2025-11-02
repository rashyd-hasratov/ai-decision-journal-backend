import { Document, model, Schema } from "mongoose";

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

const UserModel = model("User", UserSchema);

export default UserModel;
