import {
    Body,
    Controller,
    Delete,
    Get,
    Path,
    Post,
    Route,
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

    @Post()
    @SuccessResponse(200, "Module Created")
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
    public async updateModule(moduleId: string, moduleChanges: {title: string, description: string}): Promise<boolean> {
        const moduleService = new ModuleService();
        const success = await moduleService.updateModule(moduleId, moduleChanges);
        if (!success) {
          this.setStatus(400);
        }
        return true;
    }
}


