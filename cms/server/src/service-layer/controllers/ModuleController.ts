import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Path,
    Post,
    Put,
    Route,
    Security,
    SuccessResponse,
} from "tsoa";
import { ModuleService } from "../../data-layer/services/ModuleService";
import { ModuleGetResponse, ModulesGetResponse } from "../response-models/ModuleResponse";
import { IModule, IQuestion, IQuiz, ISubsection } from "../../data-layer/models/models";
import { moduleToResponse } from "../../data-layer/adapter/ModuleAdapter";

@Route("modules")
export class ModuleController extends Controller {
    private moduleService: ModuleService;

    constructor() {
        super();
        this.moduleService = new ModuleService();
    }

    @Get("/")
    @SuccessResponse(200, "Modules Fetched")
    public async getModules(): Promise<ModulesGetResponse | null> {
        const dataModules = await this.moduleService.getAllModules();
        const total = dataModules.length;
        return { modules: dataModules, total };
    }

    @Get("{moduleId}")
    @SuccessResponse(200, "Module fetched")
    public async getModule(@Path() moduleId: string): Promise<ModuleGetResponse> {
        const moduleData = await this.moduleService.getModule(moduleId);
        if (!moduleData) {
            this.setStatus(404);
            throw new Error("Module not found");
        }
        return moduleToResponse(moduleData);
    }

    @Security("jwt", ["admin"])
    @Post()
    @SuccessResponse(201, "Module Created")
    public async addModule(
        @Body() body: { title: string; description: string }
    ): Promise<IModule> {
        return this.moduleService.createModule(body);
    }

    @Put("{moduleId}")
    @SuccessResponse(200, "Module Updated")
    public async updateModule(
      @Path() moduleId: string,
      @Body() moduleChanges: { title?: string; description?: string; subsectionIds?: string[]; quizIds?: string[] }
    ): Promise<{ success: boolean }> {
      const result = await this.moduleService.updateModule(moduleId, moduleChanges);
      return { success: result };
    }

    @Delete("{moduleId}")
    @SuccessResponse(202, "Module Deleted")
    public async deleteModule(@Path() moduleId: string): Promise<{ message: string }> {
        const wasDeleted = await this.moduleService.deleteModule(moduleId);
        if (!wasDeleted) {
            this.setStatus(404);
            return { message: "Module not found or already deleted" };
        }
        return { message: "Module successfully deleted" };
    }

    //Add Subsection
    @Post("{moduleId}")
    @SuccessResponse(201, "Subsection added")
    public async addSubsection(
        @Path() moduleId: string,
        @Body() subsectionData: { title: string; body: string; authorID: string }
    ): Promise<ISubsection> {
        return this.moduleService.addSubsection(moduleId, subsectionData);
    }

    @Put("subsection/{subsectionId}")
    @SuccessResponse(202, "Subsection updated")
    public async editSubsection(
    @Path() subsectionId: string,
    @Body() subsectionChanges: { title?: string; body?: string }
    ): Promise<{ success: boolean }> {
    const result = await this.moduleService.editSubsection(subsectionId, subsectionChanges);
    return { success: result };
    }
    
    @Get("subsection/{subsectionId}")
    public async getSubsection(
      @Path() subsectionId: string
    ): Promise<ISubsection> {
        const subsection = await this.moduleService.getSubsectionById(subsectionId);
        return subsection;
    }

    //Delete Subsection
    @Delete("{moduleId}/{subsectionId}")
    public async deleteSubsectionFromModule(
        @Path() moduleId: string,
        @Path() subsectionId: string
    ): Promise<{ success: boolean }> {
        
        const result = await this.moduleService.deleteSubsection(moduleId, subsectionId);
        return { success: result };
    }

    //Create Quiz
    @Post("{moduleId}/quiz")
    public async addQuiz(
        @Path() moduleId: string,
        @Body() quizData: {title: string, description: string}
    ): Promise<IQuiz> {
        const result = await this.moduleService.addQuiz(moduleId, quizData);
        return result;
    }

    //Get Quiz
    @Get("quiz/{quizId}")
    public async getQuizById(@Path() quizId: string): Promise<IQuiz> {
      const quiz = await this.moduleService.getQuizById(quizId);
      if (!quiz) {
        this.setStatus?.(404);
        throw new Error("Quiz not found");
      }
      return quiz;
    }

    @Put("/quiz/{quizId}")
    public async updateQuiz(
      @Path() quizId: string,
      @Body() quizData: { title: string; description: string }
    ): Promise<IQuiz> {
      const updatedQuiz = await this.moduleService.updateQuiz(quizId, quizData);
      if (!updatedQuiz) {
        throw new Error("Failed to update quiz");
      }
      return updatedQuiz;
    }

    //Delete Quiz        
    @Delete("/quiz/{moduleId}/{quizId}")
    @SuccessResponse(200, "Quiz deleted")
    public async deleteQuiz(
        @Path() moduleId: string,
        @Path() quizId: string
    ): Promise<{ success: boolean; message: string }> {
        const wasDeleted = await this.moduleService.deleteQuiz(quizId, moduleId);
        
        if (!wasDeleted) {
            this.setStatus(404);
            return { success: false, message: "Quiz not found or could not be deleted" };
        }

        return { success: true, message: "Quiz successfully deleted" };
    }

    @Get("/question/{questionId}")
    public async getQuestion(@Path() questionId: string): Promise<IQuestion> {
      const question = await this.moduleService.getQuestionById(questionId);
      if (!question) {
        throw new Error("Question not found");
      }
      return question;
    }

    //Add Question
    @Post("/quiz/{quizId}")
    public async addQuestion(
        @Path() quizId: string,
        @Body() questionData: {question: string, options: string[], correctAnswer: string}) : Promise<IQuestion> {
            const newQuestion = await this.moduleService.addQuestionToQuiz(quizId, questionData);
            if (!newQuestion) {
              this.setStatus(404);
              throw new Error("Quiz not found or invalid ID");
            }
            return newQuestion;
    }
    
    //EditQuestion
    @Patch("/question/{questionId}")
    public async editQuestion(
      @Path() questionId: string,
      @Body() questionData: { question: string; options: string[]; correctAnswer: string }
    ): Promise<IQuestion> {
      const updated = await this.moduleService.updateQuestion(questionId, questionData);
    
      if (!updated) {
        this.setStatus(404);
        throw new Error("Question not found");
      }
    
      return updated;
    }
    // Delete Question
    @Delete("/quiz/{quizId}/question/{questionId}")
    @SuccessResponse(200, "Question deleted")
    public async deleteQuestion(
      @Path() quizId: string,
      @Path() questionId: string
    ): Promise<{ success: boolean; message: string }> {
      const wasDeleted = await this.moduleService.deleteQuestion(questionId, quizId);
    
      if (!wasDeleted) {
        this.setStatus(404);
        return { success: false, message: "Quiz or question not found" };
      }
    
      return { success: true, message: "Question successfully deleted" };
    }
}


