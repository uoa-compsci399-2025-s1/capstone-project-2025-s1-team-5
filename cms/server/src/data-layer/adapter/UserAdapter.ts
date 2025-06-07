import { IUser } from "../models/models";

export const userAdaptor = (mongooseUser: any): IUser => {
  return {
    id: mongooseUser._id.toString(),
    first_name: mongooseUser.first_name,
    last_name: mongooseUser.last_name,
    email: mongooseUser.email,
    password: mongooseUser.password,
    country: mongooseUser.country,
    programme: mongooseUser.programme,
    role: mongooseUser.role,
    createdAt: mongooseUser.createdAt,
  };
};
