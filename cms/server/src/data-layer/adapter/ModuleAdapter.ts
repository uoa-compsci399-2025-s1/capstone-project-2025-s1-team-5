// src/data-layer/adapter/ModuleAdapter.ts

import { ModuleGetResponse } from "../../service-layer/response-models/ModuleResponse";
import { IModule } from "../models/models";

export function moduleAdaptor(doc: any): IModule {
  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    iconKey: doc.iconKey,

    // ✏️ CHANGED: Map sortOrder from the document
    sortOrder: typeof doc.sortOrder === "number" ? doc.sortOrder : 0,

    subsectionIds: doc.subsectionIds?.map((id: any) => id.toString()) || [],
    quizIds: doc.quizIds?.map((id: any) => id.toString()) || [],
    linkIds: doc.linkIds?.map((id: any) => id.toString()) || [],
  };
}

export function moduleToResponse(module: IModule): ModuleGetResponse {
  return {
    id: module.id,
    title: module.title,
    description: module.description,
    createdAt: module.createdAt,
    updatedAt: module.updatedAt,
    // Note: sortOrder is not part of your public-facing response model here,
    // so we leave it out. If you want to expose it to the client, add it:
    // sortOrder: module.sortOrder,
    subsectionIds: module.subsectionIds?.map((id: any) => id.toString()) || [],
  };
}
