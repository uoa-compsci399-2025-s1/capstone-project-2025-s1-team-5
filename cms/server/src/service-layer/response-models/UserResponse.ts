import { IUser } from "../../data-layer/models/models";

export interface UserGetResponse {
  user: IUser;
}

export interface PaginatedUserResponse {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
}

export interface UserUpdateResponse {
  user: IUser;
}

export interface UserPostResponse {
  user: IUser;
}

export interface UserDeleteResponse {
  message: string;
}

export interface UserInfo {
  first_name: string;
  last_name: string;
  email: string;
  avatar: string;
  colorPref: string;
  country: string;
  programme: string;
}
