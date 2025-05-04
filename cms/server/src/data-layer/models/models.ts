import { Types } from "mongoose";

export enum RoleType {
    user= "user",
    admin= "admin"
}

export interface IUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    country: string;
    programme?: string;
    role: RoleType,
    createdAt: Date
}


export interface IModule {  
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt?: Date;
    subsectionIds: Types.ObjectId[];
}

export interface IProgramme {
    id: string;
    name: string;
    createdAt: Date;
}

export interface IQuestion {
    id: string;
    question: string;
    answers: string[];
    correctAnswer: string;
    createdAt: Date;
}

export interface IQuiz {
    title: string;
    description: string;
    questions: IQuestion[];
    createdAt: Date;
}

export interface ISubsection {
    id: string;
    title: string;
    body: string;
    authorID: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
}