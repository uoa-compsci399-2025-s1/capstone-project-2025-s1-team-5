import { Types, Document } from "mongoose";

export enum RoleType {
    admin= "admin",
    user= "user"
}

export interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    avatar?: string,
    colorPref?: string
    country: string;
    programme?: string;
    role: RoleType,
    createdAt: Date
}

export interface IModule {
    id: string;
    title: string;
    createdAt: Date;
    updatedAt?: Date;
    subsectionIds: Types.ObjectId[];
    quizIds: Types.ObjectId[]
}

export interface IProgramme {
    id: string;
    name: string;
    createdAt: Date;
}

export interface IQuestion {
    _id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    createdAt: Date;
}

export interface LayoutConfig {
  sections: SectionConfig[];          
}

export interface SectionConfig {
  _id?: string;
  id: string;
  layout: "full" | "split";
  splitRatio?: number[];
  columns: ColumnConfig[];
}

export interface ColumnConfig {
  _id?: string;
  blocks: BlockConfig[];
}

export interface BlockConfig {
  _id?: string;
  id: string;
  type: "text" | "image" | "video";
  html?: string;   // text 用
  src?: string;    // image/video 用
}

export interface ISubsection {
    id: string;
    title: string;
    authorID: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    layout: LayoutConfig,
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface IQuiz {
    _id: string;
    title: string;
    description: string;
    questions: IQuestion[];
    createdAt: Date;
    updatedAt: Date;

}

export interface UpdateAvatarRequest {
  avatar: string;         
}

export interface UpdateThemeRequest {
  colorPref: 'light' | 'dark';
}

export interface IPage extends Document {
  key: string;
  title: string;
  layout: LayoutConfig;
  createdAt: Date;
  updatedAt: Date;
}

