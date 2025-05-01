import { IModule } from "../../data-layer/models/models";

export interface ModulesGetResponse {
    modules: IModule[];
    total: number
}

export interface ModuleGetResponse {
    id: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt?: Date;
    subsectionIds: string[];
}

export interface SubsectionResponse {
    title: string;
    body: string;
    authorID: string;
    published: boolean;
}