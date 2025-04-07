import {
    Controller,
    Get,
    Path,
    Route,
    SuccessResponse,
} from "tsoa";

import { User } from "../../data-layer/models/models";
import { UserService } from "../../data-layer/services/UserService";
import { UserGetResponse } from "../response-models/UserResponse";

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
}