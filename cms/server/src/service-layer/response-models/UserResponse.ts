import { IUser } from "../../data-layer/models/models"

export interface UserGetResponse {
    data: {
        user: IUser
    }
}
export interface UserPostResponse {
        user: IUser
}