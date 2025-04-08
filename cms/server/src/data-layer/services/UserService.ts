import { PaginatedUserResponse } from "../../service-layer/response-models/UserResponse";
import { userAdaptor } from "../adapter/UserAdapter";
import { RoleType, IUser } from "../models/models";
import User from "../models/schema";

export type UserCreationParams = Pick<IUser, "first_name" | "last_name" | "email" | "password" | "country" | "programme">
export type UserUpdateParams = Pick<IUser, "password" | "country" | "programme">


export class UserService {
    /**
     * Method to fetch a user by ID
     * @param userID the user id to fetch
     * @returns The user
     */
    public async getUser(userID: string) : Promise<IUser> {
        return {
            id: "12738647836278yhdufheiufgyu8eg",
            first_name: "derick",
            last_name: "trands",
            email: "dericktran1@gmail.com",
            password: "wowowowowo123@",
            country: "new zealand",
            programme: "CS201",
            role: RoleType.user,
            createdAt: new Date()
        }
    }
    /**
     * Method to fetch a certain amount of users 
     * @param limit and page number
     * @returns list of users
     */
    public async getPaginatedUsers(limit = 10, page = 1) : Promise<PaginatedUserResponse | null> {
        try {
            const skip = (page - 1) * limit
            const fetchedUsers = await User.find().skip(skip).limit(limit);
            const total = await User.countDocuments()
            return {
                users: fetchedUsers.map(userAdaptor),
                total, 
                page,
                limit
            };
        } catch (error) {
            console.error("Error fetching users", error);
            return null
        }
    }
    /**
     * Method to create new User
     * @param UserCreationsParams - user information from input
     * @returns void (Create User)
     */
    public async createUser(userCreationParams: UserCreationParams): Promise<IUser> | null {
        try {
            const newUser = new User({...userCreationParams, role: "user"});

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
    public async updateUser(userId: string, userUpdateParams: UserUpdateParams): Promise<IUser> | null {
        try {
            const updateUser = await User.findByIdAndUpdate(
                userId,
                { $set: userUpdateParams },
                { new: true }
            );
            if (!updateUser) {
                return null
            }
            return userAdaptor(updateUser)
        } catch (error) {
            console.error("Error updating user", error)
            return null
        }
    }
}