import { IModule } from "../../data-layer/models/models";
import { IsArray, ArrayMinSize, ArrayMaxSize, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

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
    subsections: Array<{
        id: string;
        title: string;
    }>;
}

export interface SubsectionResponse {
    title: string;
    body: string;
    authorID: string;
    published: boolean;
}

export class LayoutBlockDTO {
  blockId!: string;
  side!: "left" | "right";
  order!: number;
}

export class LayoutConfigDTO {
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  split!: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LayoutBlockDTO)
  blocks!: LayoutBlockDTO[];
}