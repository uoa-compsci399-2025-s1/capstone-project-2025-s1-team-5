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

// 对应前端 BlockConfig
class BlockDTO {
  @IsString()              id!: string;
  @IsEnum(['text','image','video'] as const)
                           type!: 'text' | 'image' | 'video';
  @IsString()              html!: string;
  @IsOptional() @IsString()
                           src?: string;
}

// 对应前端 ColumnConfig
class ColumnDTO {
  @IsArray() @ValidateNested({ each: true }) @Type(() => BlockDTO)
                           blocks!: BlockDTO[];
}

// 对应前端 SectionConfig
class SectionDTO {
  @IsString()                             id!: string;
  @IsEnum(['full','split'] as const)     layout!: 'full' | 'split';
  @IsOptional()
  @IsArray() @ArrayMinSize(2) @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
                                         splitRatio?: number[];
  @IsArray() @ValidateNested({ each: true }) @Type(() => ColumnDTO)
                                         columns!: ColumnDTO[];
}

// 最外层 payload
export class LayoutSectionsDTO {
  @IsArray() @ValidateNested({ each: true }) @Type(() => SectionDTO)
  sections!: SectionDTO[];
}