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
    subsectionIds: string[];
}

export interface IProgramme {
    id: string;
    name: string;
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