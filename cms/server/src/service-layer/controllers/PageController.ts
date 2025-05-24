// src/service-layer/controllers/PageController.ts
import { Controller, Get, Put, Body, SuccessResponse, Security, Path, Route } from "tsoa";
import { PageService } from "../../data-layer/services/PageService";
import { LayoutConfig } from "../../data-layer/models/models";

@Route("pages") 
export class PageController extends Controller {
  private svc = new PageService();

  @Security("jwt", ["admin"])
  @Get("{key}")
  public async getPage(@Path() key: string): Promise<{ title: string; layout: LayoutConfig }> {
    return this.svc.getPage(key);
  }

  @Security("jwt", ["admin"])
  @Put("{key}")
  @SuccessResponse(200, "Updated")
  public async updatePage(
    @Path() key: string,
    @Body() body: { title: string; layout: LayoutConfig }
  ): Promise<{ success: boolean }> {
    const ok = await this.svc.updatePage(key, body.title, body.layout);
    if (!ok) {
      this.setStatus(400);
      return { success: false };
    }
    return { success: true };
  }
}
