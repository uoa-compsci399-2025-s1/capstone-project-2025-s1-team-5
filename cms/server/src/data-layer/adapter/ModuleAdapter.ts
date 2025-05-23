import { ModuleGetResponse } from "../../service-layer/response-models/ModuleResponse";
import { IModule } from "../models/models";

export function moduleAdaptor(doc: any): IModule {
    return {
      id: doc._id.toString(),
      title: doc.title,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      subsectionIds: doc.subsectionIds?.map((id: any) => id.toString()) || [],
      quizIds: doc.quizIds?.map((id: any) => id.toString()) || []

    };
  }

export function moduleToResponse(module: IModule): ModuleGetResponse {
  return {
    id: module.id,
    title: module.title,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
    subsections: module.subsectionIds?.map((sub: any) => ({
      id: sub._id.toString(), 
      title: sub.title,
    })) || [],
  };
}