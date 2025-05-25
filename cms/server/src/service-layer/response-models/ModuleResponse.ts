import { IModule } from "../../data-layer/models/models";
import {
  IsArray, ArrayMinSize, ArrayMaxSize,
  ValidateNested, IsString, IsEnum, IsOptional, IsMongoId
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
  @IsString()            id!: string;
  @IsOptional()
  @IsMongoId()
  _id?: string;
  @IsEnum(["text","image","video"])  type!: "text"|"image"|"video";
  @IsString()            html!: string;
}

export class ColumnConfigDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockConfigDTO)
  blocks!: BlockConfigDTO[];
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

export class SectionConfigDTO {
  @IsString()  id!: string;
  @IsEnum(["full","split"])  layout!: "full"|"split";
  @IsOptional()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  splitRatio?: number[];
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ColumnConfigDTO)
  columns!: ColumnConfigDTO[];
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

export class LayoutSectionsDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionConfigDTO)
  sections!: SectionConfigDTO[];
  @IsOptional()
  @IsMongoId()
  _id?: string;
}

export class QuizDto {
  public _id!: string;
  public title!: string;
  public description!: string;
  public questions!: string[];
  public createdAt!: Date;
  public updatedAt!: Date;
}