import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Query,
    Route,
    SuccessResponse,
} from "tsoa";

import { UserService, UserCreationParams, UserUpdateParams } from "../../data-layer/services/UserService";
import { PaginatedUserResponse, UserGetResponse, UserPostResponse, UserUpdateResponse } from "../response-models/UserResponse";
import { userAdaptor } from "../../data-layer/adapter/UserAdapter";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../data-layer/models/schema";

@Route("users")
export class UsersController extends Controller {     
    @Get() //Admin Method need Authorisation
    @SuccessResponse(200, "Page Users fetched") 
    public async getUsers(
        @Query() limit: number = 10,
        @Query() page: number = 1
    ): Promise<PaginatedUserResponse>  {
        const userService = new UserService();
        const fetchedUsers = await userService.getPaginatedUsers(limit, page);

        if (!fetchedUsers) {
            this.setStatus(404);
            throw new Error("Could not fetch users");
        }
    
        return fetchedUsers;
    }
    
    @Get("{userId}") //User/Admin Method 
    @SuccessResponse(200, "User fetched")
    public async getUser(
        @Path() userId: string,
    ): Promise<UserGetResponse> {
        const user = await new UserService().getUser(userId);
        return {user: userAdaptor(user)};
    }
    @Post() 
    @SuccessResponse(201, "User created") 
    public async createUser(
        @Body() requestbody: UserCreationParams
    ): Promise<UserPostResponse> {
        const newUser = await new UserService().createUser(requestbody);
        this.setStatus(201); 
        return {user: newUser}
    }
        

    @Put("{userId}") 
    @SuccessResponse(200, "User updated")
    public async updateUser(
        @Path() userId: string,
        @Body() updateParams: UserUpdateParams
    ): Promise<UserUpdateResponse> {
        const updatedUser = await new UserService().updateUser(userId, updateParams);

        if (!updatedUser) {
            this.setStatus(404);
            throw new Error("User not found");
        }

        return { user: updatedUser };
    }

    @Delete("{userId}")
    @SuccessResponse(202, "User deleted")
    public async deleteUser(
        @Path() userId: string
    ): Promise<{ message: string }> {
        const wasDeleted = await new UserService().deleteUser(userId);
        
        if (!wasDeleted) {
            this.setStatus(404);
            return { message: "User not found or already deleted" };
        }
    
        return { message: "User successfully deleted" };

    }

    
    @Post("/login")
    public async login(@Body() credentials: { email: string, password: string }): Promise<{ token: string }> {
    const user = await User.findOne({ email: credentials.email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(credentials.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
    );

    return { token };
    }
}

