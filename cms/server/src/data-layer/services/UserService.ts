import mongoose from "mongoose";
import {
  PaginatedUserResponse,
  UserInfo,
} from "../../service-layer/response-models/UserResponse";
import { userAdaptor } from "../adapter/UserAdapter";
import { IUser } from "../models/models";
import { User } from "../models/schema";
import * as bcrypt from "bcrypt";

export type UserCreationParams = Pick<
  IUser,
  | "first_name"
  | "last_name"
  | "email"
  | "password"
  | "country"
  | "programme"
  | "colorPref"
>;
export type UserUpdateParams = Pick<
  IUser,
  | "first_name"
  | "last_name"
  | "email"
  | "password"
  | "country"
  | "programme"
  | "role"
>;

export class UserService {
  /**
   * Method to fetch a user by ID
   * @param userID the user id to fetch
   * @returns The user
   */
  public async getUser(userID: string): Promise<IUser | null> {
    try {
      const user = await User.findById(userID).exec();
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Failed to fetch user");
    }
  }
  /**
   * Method to fetch a certain amount of users
   * @param limit how many users per page
   * @param pageNumber page number
   * @returns list of users
   */
  public async getPaginatedUsers(
    limit = 10,
    page = 1,
  ): Promise<PaginatedUserResponse | null> {
    try {
      const skip = (page - 1) * limit;
      const fetchedUsers = await User.find().skip(skip).limit(limit);
      const total = await User.countDocuments();

      return {
        users: fetchedUsers.map(userAdaptor),
        total,
        page,
        limit,
      };
    } catch (error) {
      console.error("Error fetching users", error);
      return null;
    }
  }
  /**
   * Method to create new User
   * @param UserCreationsParams - user information from input
   * @returns void (Create User)
   */
  public async createUser(
    userCreationParams: UserCreationParams,
  ): Promise<IUser | null> {
    try {
      const hashedPassword = await bcrypt.hash(userCreationParams.password, 10);

      const newUser = new User({
        ...userCreationParams,
        password: hashedPassword,
        role: "user",
      });

      await newUser.save();
      return userAdaptor(newUser);
    } catch (error) {
      console.log("Error creating user", error);
      return null;
    }
  }
  /**
   * Method to update user information
   * @param userUpdateParams
   * @returns updatedUser information
   */
  public async updateUser(
    userId: string,
    userUpdateParams: UserUpdateParams,
  ): Promise<IUser> | null {
    try {
      if (userUpdateParams.password) {
        userUpdateParams.password = await bcrypt.hash(
          userUpdateParams.password,
          10,
        );
      }
      const updateUser = await User.findByIdAndUpdate(
        userId,
        { $set: userUpdateParams },
        { new: true },
      );
      if (!updateUser) {
        return null;
      }
      return userAdaptor(updateUser);
    } catch (error) {
      console.error("Error updating user", error);
      return null;
    }
  }
  /**
   * Method to delete user
   * @param userID
   * @returns void - deletes user
   */
  public async deleteUser(userId: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return false
    }

    const deletedUser = await User.findByIdAndDelete(userId);
    return !!deletedUser;
  }
  /**
   *
   * @param email
   * @param password
   * @returns User
   */
  public async findUserByLogin(
    email: string,
    password: string,
  ): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      return user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  public async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await User.findById(userId);
    if (!user) return false;
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return false;

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashed });
    return true;
  }
  public async getUserInfo(userId: string): Promise<UserInfo> {
    const userDoc = await User.findById(userId).select(
      "first_name last_name email colorPref avatar country programme",
    );
    if (!userDoc) return null;
    const userInfo = userDoc.toObject() as UserInfo;
    return userInfo;
  }

  public async updateAvatar(userId: string, avatar: string): Promise<boolean> {
    const result = await User.findByIdAndUpdate(
      userId,
      { $set: { avatar } },
      { new: false },
    );
    return !!result;
  }

  public async updateThemePreference(
    userId: string,
    colorPref: "light" | "dark",
  ): Promise<boolean> {
    const result = await User.findByIdAndUpdate(
      userId,
      { $set: { colorPref } },
      { new: false },
    );
    return !!result;
  }

  public async findByEmail(email: string): Promise<boolean> {
    const user = await User.findOne({ email }).exec();
    return !!user;
  }
}
