import { IModule } from "../../data-layer/models/models";
import {
  IsArray,
  ValidateNested,
  ArrayMinSize,
  ArrayMaxSize,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
} from "class-validator";
import { Type } from "class-transformer";

export interface ModulesGetResponse {
    modules: IModule[];
    total: number
}

export interface ModuleGetResponse {
    id: string;
    title: string;
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

export class BlockConfigDTO {
  @IsString()
  id!: string;

  @IsEnum(["text","image","video"] as const)  // 根据你支持的块类型来改
  type!: "text" | "image" | "video";

  @IsString()
  html!: string;      // 或者 image/video 的 url 字段
}

export class ColumnConfigDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockConfigDTO)
  blocks!: BlockConfigDTO[];
}

export class SectionConfigDTO {
  @IsString()
  id!: string;

  @IsEnum(["full","split"] as const)
  layout!: "full" | "split";

  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  splitRatio?: number[];   // split 时的比例

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnConfigDTO)
  columns!: ColumnConfigDTO[];
}

export class LayoutConfigDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionConfigDTO)
  sections!: SectionConfigDTO[];
}