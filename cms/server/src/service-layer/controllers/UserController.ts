import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Route,
    SuccessResponse,
} from "tsoa";

import { UserService, UserCreationParams } from "../../data-layer/services/UserService";
import { UserGetResponse, UserPostResponse } from "../response-models/UserResponse";

@Route("users")
export class UsersController extends Controller {
    @Get("{userId}")
    @SuccessResponse(200, "User fetched")
    public async getUser(
        @Path() userId: string,
    ): Promise<UserGetResponse> {
        return {
            data: {user: await(new UserService()).getUser(userId)}}
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
    
}

