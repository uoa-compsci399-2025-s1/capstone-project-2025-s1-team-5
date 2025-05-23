import { Types } from "mongoose";

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
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
    createdAt: Date;
}

export interface IQuiz {
    title: string;
    description: string;
    questions: Types.ObjectId[];
    createdAt: Date;
}

export interface LayoutBlock {
  blockId: string;
  side: "left" | "right";
  order: number;
}

export interface LayoutConfig {
  sections: SectionConfig[];          
}

export interface SectionConfig {
  id: string;
  layout: "full" | "split";
  splitRatio?: number[];
  columns: ColumnConfig[];
}

export interface ColumnConfig {
  blocks: BlockConfig[];
}

export interface BlockConfig {
  id: string;
  type: "text"; 
  html: string;
}

export interface ISubsection {
    id: string;
    title: string;
    body: string;
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
    title: string;
    description: string;
    questions: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;

}

export interface UpdateAvatarRequest {
  avatar: string;         
}

export interface UpdateThemeRequest {
  colorPref: 'light' | 'dark';
}
