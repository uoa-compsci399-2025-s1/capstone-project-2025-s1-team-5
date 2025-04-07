export enum RoleType {
    admin= "admin",
    user= "user"
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    country: string;
    programme: string;
    role: RoleType,
    createdAt: Date
}

export interface Module {
    id: string;
    title: string;
    description: string;
    createdAt: Date
    updatedAt?: Date
    subsectionID: string
}

export interface Programme {
    id: string;
    name: string;
    createdAt: Date;
}

export interface Subsection {
    id: string;
    title: string;
    body: string;
    authorID: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date
}