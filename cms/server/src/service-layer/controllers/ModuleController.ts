import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Put,
    Route,
    // Security,
    SuccessResponse,
} from "tsoa";
import { ModuleService } from "../../data-layer/services/ModuleService";
import { ModuleGetResponse, ModulesGetResponse } from "../response-models/ModuleResponse";
import { IModule } from "../../data-layer/models/models";

@Route("modules")
export class ModuleController extends Controller {  
    @Get("/")
    @SuccessResponse(200, "Modules Fetched")
    public async getModules(): Promise<ModulesGetResponse | null> {
        const moduleService = new ModuleService();
        const dataModules = await moduleService.getAllModules();
        const total = dataModules.length
      return { modules: dataModules, total}
    }

    @Get("{moduleId}")
    @SuccessResponse(200, "Module fetched")
    public async getModule(
        @Path() moduleId: string,
    ): Promise<ModuleGetResponse> {
        const moduleService = new ModuleService();
        const moduleData = await moduleService.getModule(moduleId);
        return moduleData;
    }

    // @Security("jwt", ["admin"])
    @Post()
    @SuccessResponse(201, "Module Created")
    public async addModule(@Body() body: {title: string, description: string}): Promise<IModule> {
        const moduleService = new ModuleService();
        const newModule = await moduleService.createModule(body);
        return newModule;
    }

    @Delete("{moduleId}")
    @SuccessResponse(202, "Module Deleted")
    public async deleteModule(
        @Path() moduleId: string
    ): Promise<{message: string}> {
        const moduleService = new ModuleService();
        const wasDeleted = await moduleService.deleteModule(moduleId)
        if (!wasDeleted) {
            this.setStatus(404);
            return { message: "Module not found or already deleted" };
        }
        return { message: "Module successfully deleted" };
    }
    
    @Post("{moduleId}")
    @SuccessResponse(201, "Subsection added")
    public async addSubsection(
        moduleId: string,
        @Body() subsectionData: { title: string; body: string; authorID: string }
      ): Promise<{ success: boolean }> {
        const moduleService = new ModuleService()
        const result = await moduleService.addSubsection(moduleId, subsectionData);
        return { success: result };
    }

    @Put("{moduleId}/{subsectionId}")
    @SuccessResponse(200, "Subsection updated")
    public async editSubsection(
    moduleId: string,
    subsectionId: string,
    @Body() subsectionChanges: { title?: string; body?: string }
    ): Promise<{ success: boolean }> {
    const moduleService = new ModuleService();
    const result = await moduleService.editSubsection(moduleId, subsectionId, subsectionChanges);
    return { success: result };
    }


    @Delete("{moduleId}/{subsectionId}")
    public async deleteSubsectionFromModule(
      @Path() moduleId: string,
      @Path() subsectionId: string
    ): Promise<{ success: boolean }> {
        const moduleService = new ModuleService()
        const result = await moduleService.deleteSubsection(moduleId, subsectionId);
        return { success: result };
    }
    
    // @Post("{moduleId/{subsectionId}")
    // public async addQuizSubsection(
    //     @Path() moduleId: string,
    //     @Path() subsectionId: string
    // ): Promise< {success: boolean} > {
    //     const moduleService = new ModuleService()
    //     const 
    // }
}


