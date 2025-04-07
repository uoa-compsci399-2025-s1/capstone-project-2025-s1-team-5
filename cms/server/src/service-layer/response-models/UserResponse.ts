import { User } from "../../data-layer/models/models"

export interface UserGetResponse {
    data: {
        user: User
    }
}