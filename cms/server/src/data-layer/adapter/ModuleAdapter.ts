import { IModule } from "../models/models";

export function moduleAdaptor(doc: any): IModule {
    return {
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      subsectionIds: doc.subsectionIds?.map((id: any) => id.toString()) || []
    };
  }