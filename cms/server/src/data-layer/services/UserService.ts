import { userAdaptor } from "../adapter/UserAdapter";
import { RoleType, IUser } from "../models/models";
import User from "../models/schema";

export type UserCreationParams = Pick<IUser, "first_name" | "last_name" | "email" | "password" | "country" | "programme">

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
}