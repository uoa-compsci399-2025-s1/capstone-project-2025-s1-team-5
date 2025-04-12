import {
    Controller,
    Get,
    Path,
    Route,
    SuccessResponse,
} from "tsoa";
import { ModuleService } from "../../data-layer/services/ModuleService";
import { ModuleGetResponse, ModulesGetResponse } from "../response-models/ModuleResponse";

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
        const moduleService = new ModuleService()
        const moduleData = await moduleService.getModule(moduleId)
        return moduleData
    }

    // @Post("/{moduleId}/subsection")
    // @SuccessResponse(201, "Subsection Created")
    // public async createSubsectionForModule(
    //     @Path() id: string,
    //     @Body() data: { title: string; body: string; authorID: string }
    //  ): Promise<SubsectionResponse> {
    //     const moduleService = new ModuleService();
    //     const subsection = await moduleService.createSubsectionForModule(id, data);
    //     return subsection;
    //  }
}


  