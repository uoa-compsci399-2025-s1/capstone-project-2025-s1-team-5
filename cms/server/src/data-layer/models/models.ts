import { Types } from "mongoose";

export enum RoleType {
  admin = "admin",
  user = "user",
}

export interface IUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  avatar?: string;
  colorPref?: string;
  country: string;
  programme?: string;
  role: RoleType;
  createdAt: Date;
}

export interface IModule {
  id: string;
  title: string;
  description: string;
  iconKey?: string; 
  createdAt: Date;
  updatedAt?: Date;
  subsectionIds: Types.ObjectId[];
  quizIds: Types.ObjectId[];
  linkIds: Types.ObjectId[];
  sortOrder: number;
}

export interface IProgramme {
  id: string;
  name: string;
  description: string;
  link: string;
  createdAt: Date;
}

export interface IQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  createdAt: Date;
}


export interface ISubsection {
  id: string;
  title: string;
  body: string;
  iconKey?: string; 
  authorID: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface IQuiz {
  title: string;
  description: string;
  questions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  iconKey?: string; 
}

export interface ILink {
  title: string;
  link: string;
  createdAt: Date;
  updatedAt: Date;
  iconKey?: string; 
}

export interface UpdateAvatarRequest {
  avatar: string;
}

export interface UpdateThemeRequest {
  colorPref: "light" | "dark";
}
