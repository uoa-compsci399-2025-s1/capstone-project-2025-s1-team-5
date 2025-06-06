import {
  Body,
  Controller,
  Delete,
  Get,
  Path,
  Post,
  Put,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import { ProgrammeService } from "../../data-layer/services/ProgrammeService";
import { IProgramme } from "../../data-layer/models/models";

@Route("programmes")
@Tags("Programmes")
export class ProgrammeController extends Controller {
  private programmeService: ProgrammeService;

  constructor() {
    super();
    this.programmeService = new ProgrammeService();
  }

  @Get("/")
  @SuccessResponse(200, "Programmes Fetched")
  public async getProgrammes(): Promise<IProgramme[]> {
    const programmes = await this.programmeService.getAllProgrammes();
    return programmes;
  }
  @Security("jwt", ["admin"])
  @Post("/")
  @SuccessResponse(201, "Programme Created")
  public async addProgramme(
    @Body() body: { name: string; description: string; link: string },
  ): Promise<IProgramme> {
    return this.programmeService.createProgramme(
      body.name,
      body.description,
      body.link,
    );
  }
    @Security("jwt", ["admin"])
  @Put("{programmeId}")
  @SuccessResponse(200, "Programme Updated")
  public async updateProgramme(
    @Path() programmeId: string,
    @Body() changes: { name?: string; description?: string; link?: string },
  ): Promise<boolean> {
    const updated = await this.programmeService.updateProgrammeById(
      programmeId,
      changes,
    );
    return updated !== null;
  }

    @Security("jwt", ["admin"])
    @Delete("{programmeId}")
    @SuccessResponse(202, "Programme Deleted")
    public async deleteProgramme(@Path() programmeId: string): Promise<boolean> {
    const wasDeleted =
      await this.programmeService.deleteProgrammeById(programmeId);
    if (!wasDeleted) {
      this.setStatus(404);
    }
    return wasDeleted;
  }
}
