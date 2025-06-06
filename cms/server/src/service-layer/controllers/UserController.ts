import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Patch,
    Query,
    Route,
    SuccessResponse,
    Security,
    Request,
    Tags,
} from "tsoa";

import { UserService, UserCreationParams, UserUpdateParams } from "../../data-layer/services/UserService";
import { PaginatedUserResponse, UserGetResponse, UserInfo, UserPostResponse, UserUpdateResponse } from "../response-models/UserResponse";
import { userAdaptor } from "../../data-layer/adapter/UserAdapter";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { User } from "../../data-layer/models/schema";
import { UpdateAvatarRequest, UpdateThemeRequest } from '../../data-layer/models/models';

@Route("users")
@Tags("Users")
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

    @Get("userInfo/{userId}")
    @SuccessResponse(200, "User Information Fetched")
    public async GetUserInfo(@Path() userId: string):
    Promise<UserInfo> {
        const userService = new UserService()
        const userInfo = userService.getUserInfo(userId)
        if (!userInfo) {
            this.setStatus(404);
            throw new Error("User not found");
          }
          return userInfo;
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

    @Security("jwt", ["admin"])    
    @Post("/login/admin")
    public async adminlogin(@Body() credentials: { email: string, password: string }): Promise<{ token: string }> {
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

    @Patch('/me/avatar')
    @Security('jwt')
    public async updateAvatar(
        @Body() body: UpdateAvatarRequest,
        @Request() req: any
    ): Promise<{ message: string }> {
        const userId = req.user?.id;
        if (!userId) {
        this.setStatus(401);
        return { message: 'Unauthorized' };
        }
        const ok = await new UserService().updateAvatar(userId, body.avatar);
        if (!ok) {
        this.setStatus(400);
        return { message: 'Failed to update avatar' };
        }
        return { message: 'Avatar updated successfully' };
    }

    /** Update logged-in user’s theme preference */
    @Patch('/me/theme')
    @Security('jwt')
    public async updateTheme(
        @Body() body: UpdateThemeRequest,
        @Request() req: any
    ): Promise<{ message: string }> {
        const userId = req.user?.id;
        if (!userId) {
        this.setStatus(401);
        return { message: 'Unauthorized' };
        }
        const ok = await new UserService().updateThemePreference(userId, body.colorPref);
        if (!ok) {
        this.setStatus(400);
        return { message: 'Failed to update theme preference' };
        }
        return { message: 'Theme preference updated successfully' };
    }
}

