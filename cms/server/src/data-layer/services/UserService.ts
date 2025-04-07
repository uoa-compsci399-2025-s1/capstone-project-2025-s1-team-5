import { RoleType, User } from "../models/models";

export class UserService {
    /**
     * Method to fetch a user by ID
     * @param userID the user id to fetch
     * @returns The user
     */
    public async getUser(userID: string) : Promise<User> {
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
}