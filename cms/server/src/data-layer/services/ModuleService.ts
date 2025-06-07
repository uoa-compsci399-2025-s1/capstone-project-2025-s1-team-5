import { moduleAdaptor } from "../adapter/ModuleAdapter";
import type {
  IModule,
  IQuestion,
  IQuiz,
  ISubsection,
  ILink,
} from "../models/models";
import {
  Link,
  newModule,
  Question,
  Quiz,
  Subsection,
} from "../../data-layer/models/schema";
import mongoose from "mongoose";
import {
  ModuleResponse,
  QuizDTO,
  QuestionDTO,
} from "../../service-layer/response-models/ModuleResponse";

export class ModuleService {
  /**
   * Method to fetch all modules
   * @returns List of all modules
   */
  public async getAllModules(): Promise<IModule[]> {
    const fetchedModules = await newModule
      .find()
      .sort({ sortOrder: 1 }) // make sure we sort by sortOrder
      .exec();
    return fetchedModules.map(moduleAdaptor);
  }

  public async getModule(moduleId: string): Promise<ModuleResponse | null> {
    try {
      const module = await newModule
        .findById(moduleId)
        .populate("subsectionIds", "title")
        .populate("linkIds", "title link")
        .populate({
          path: "quizIds",
          populate: { path: "questions" },
        })
        .lean();
      if (!module) {
        return null;
      }
      return {
        id: module._id.toString(),
        title: module.title,
        description: module.description,
        quizzes: (module.quizIds as any[]).map(
          (q): QuizDTO => ({
            id: q._id.toString(),
            title: q.title,
            description: q.description,
            questions: (q.questions as any[]).map(
              (qa): QuestionDTO => ({
                id: qa._id.toString(),
                question: qa.question,
                options: qa.options,
                correctAnswer: qa.correctAnswer,
              }),
            ),
          }),
        ),
        subsections: (module.subsectionIds as any[]).map((sub) => ({
          id: (sub._id as any).toString(),
          title: sub.title,
        })),
        links: (module.linkIds as any[]).map((l) => ({
          id: l._id.toString(),
          title: l.title,
          url: l.link,
        })),
      };
    } catch (error) {
      console.error("Error fetching module with subsections", error);
      return null;
    }
  }
  /**
   * Creates new module
   * @param data
   * @returns yes
   */
  public async createModule(data: Partial<IModule>): Promise<IModule> {
    // ✏️ Count existing modules, then give new one sortOrder = count
    const existingCount = await newModule.countDocuments().exec();
    const moduleDoc = new newModule({
      title: data.title,
      description: data.description,
      subsectionIds: [],
      sortOrder: existingCount, // append to end\
      iconKey: data.iconKey,

    });
    const saved = await moduleDoc.save();
    return saved.toObject();
  }
  /**
   *
   * @param moduleId
   * @returns
   */
  public async deleteModule(moduleId: string): Promise<boolean> {
    try {
      if (!mongoose.Types.ObjectId.isValid(moduleId)) {
        return false;
      }

      const module = await newModule.findById(moduleId);

          if (module.quizIds?.length) {
            await Promise.all(
              module.quizIds.map(async (quizId) => {
                return await this.deleteQuiz(quizId.toString(), moduleId);
              })
            );
          }

            if (module.linkIds?.length) {
            await Promise.all(
              module.linkIds.map(async (linkId) => {
                return await this.deleteLink(moduleId, linkId.toString());
              })
            );
          }


          if (module.subsectionIds?.length) {
            await Promise.all(
              module.subsectionIds.map(async (subsectionId) => {
                return await Subsection.findByIdAndDelete(subsectionId);
              })
            );
          }

      const deletedModule = await newModule.findByIdAndDelete(moduleId);
      return !!deletedModule;
    } catch (error) {
      console.error("Error deleting module:", error);
      return false;
    }
  }

  public async reorderModules(orderedIds: string[]): Promise<boolean> {
    if (!Array.isArray(orderedIds)) return false;
    try {
      for (let i = 0; i < orderedIds.length; i++) {
        const moduleId = orderedIds[i];
        if (!mongoose.Types.ObjectId.isValid(moduleId)) continue;
        await newModule
          .updateOne({ _id: moduleId }, { $set: { sortOrder: i } })
          .exec();
      }
      return true;
    } catch (error) {
      console.error("Error reordering modules:", error);
      return false;
    }
  }
  /**
   * Updates Module title and
   * @param moduleId
   * @param moduleChanges
   * @returns
   */
  public async updateModule(
    moduleId: string,
    moduleChanges: {
      title?: string;
      description?: string;
      subsectionIds?: string[];
      quizIds?: string[];
      linkIds?: string[];
      iconKey?: string;
    },
  ): Promise<boolean> {
    try {
      const module = await newModule.findById(moduleId);

      if (!module) {
        return false;
      }

      if (moduleChanges.title !== undefined) module.title = moduleChanges.title;
      if (moduleChanges.description !== undefined)
        module.description = moduleChanges.description;

      if (moduleChanges.subsectionIds !== undefined) {
        module.subsectionIds = moduleChanges.subsectionIds.map(
          (id) => new mongoose.Types.ObjectId(id),
        );
      }

      if (moduleChanges.quizIds !== undefined) {
        module.quizIds = moduleChanges.quizIds.map(
          (id) => new mongoose.Types.ObjectId(id),
        );
      }

      if (moduleChanges.linkIds !== undefined) {
        module.linkIds = moduleChanges.linkIds.map(
          (id) => new mongoose.Types.ObjectId(id),
        );
      }

      if (moduleChanges.iconKey !== undefined) {
        module.iconKey = moduleChanges.iconKey
      }
      await module.save();
      return true;
    } catch (error) {
      console.error("Error updating module:", error);
      return false;
    }
  }
  /**
   * Add Subsection to a module
   * @param moduleId
   * @param subsectionData
   * @returns
   */
  public async addSubsection(
    moduleId: string,
    subsectionData: { title: string; body: string; authorID: string },
  ): Promise<ISubsection | null> {
    try {
      const module = await newModule.findById(moduleId);
      if (!module) {
        throw new Error("Module not found");
      }

      const newSubsection = new Subsection({
        title: subsectionData.title,
        body: subsectionData.body,
        authorID: subsectionData.authorID,
      });

      await newSubsection.save();

      if (!newSubsection._id) {
        throw new Error("Subsection ID not generated");
      }

      module.subsectionIds.push(newSubsection._id);
      await module.save();
      return newSubsection;
    } catch (error: any) {
      return error;
    }
  }

  public async getSubsectionById(subsectionId: string): Promise<ISubsection> {
    const subsection = await Subsection.findById(subsectionId);
    if (!subsection) {
      throw new Error("Subsection Not Found");
    }
    return subsection;
  }

    /**
     * Deletes Subsection of a module
     * @param moduleId 
     * @param subsectionId 
     * @returns 
     */
    public async deleteSubsection(moduleId: string, subsectionId: string): Promise<boolean> {
        try {
          const module = await newModule.findById(moduleId);
          if (!module) throw new Error("Module not found");
    
          module.subsectionIds = module.subsectionIds.filter(
            (id) => id.toString() !== subsectionId
          );
          await module.save();
    
          await Subsection.findByIdAndDelete(subsectionId);
    
          return true;
        } catch (error) {
          console.error("Failed to delete subsection:", error);
          return false;
        }
      }
      /**
       * Edit Subsection body and title
       * @param moduleId 
       * @param subsectionId 
       * @param changes 
       * @returns 
       */
      public async editSubsection(
        subsectionId: string,
        changes: { title?: string; body?: string }
      ): Promise<boolean> {
        try {
          const subsection = await Subsection.findById(subsectionId);
          if (!subsection) {
            throw new Error("Subsection not found");
          }
      
          if (changes.title !== undefined) subsection.title = changes.title;
          if (changes.body !== undefined) subsection.body = changes.body;
      
          const parentModule = await newModule.findOne({ subsectionIds: subsectionId });
          if (parentModule) {
            await this.updateModuleTimestamp(parentModule._id.toString());
          }

          await subsection.save();
          
          return true;
        } catch (error) {
          console.error("Error editing subsection:", error);
          return false;
        }
    }
    /**
     * Edit Description/title of module
     * @param moduleId 
     * @param changes 
     * @returns 
     */
    public async editModule(
        moduleId: string,
        changes: { title?: string; description?: string }
      ): Promise<boolean> {
        try {
          const module = await newModule.findById(moduleId);
          if (!module) {
            throw new Error("Module not found");
          }
      
          if (changes.title !== undefined) module.title = changes.title;
          if (changes.description !== undefined) module.description = changes.description;
      
          await module.save();
          return true;
        } catch (error) {
          console.error("Error editing module:", error);
          return false;
        }
      }
      /**
       * 
       * @param moduleId Id of the Module, where we are inserting new Quiz Documment
       * @param quizData Title and Description of Quiz
       * @returns 
       */

  public async addQuiz(
    moduleId: string,
    quizData: { title: string; description: string },
  ): Promise<IQuiz> {
    try {
      const module = await newModule.findById(moduleId);
      if (!module) {
        throw new Error("Module not found");
      }

      const newQuiz = new Quiz(quizData);
      await newQuiz.save();
      module.quizIds.push(newQuiz._id);
      await module.save();
      return newQuiz;
    } catch (error: any) {
      return error;
    }
  }

  public async getQuizById(quizId: string): Promise<IQuiz | null> {
    try {
      const quiz = await Quiz.findById(quizId).populate("questions").exec();
      if (!quiz) {
        return null;
      }
      return quiz;
    } catch (error) {
      console.error("Error fetching quiz by ID:", error);
      return null;
    }
  }

  public async updateQuiz(
    quizId: string,
    quizData: { title: string; description: string },
  ): Promise<IQuiz | null> {
    try {
      const quiz = await Quiz.findByIdAndUpdate(
        quizId,
        {
          title: quizData.title,
          description: quizData.description,
        },
        { new: true },
      ).exec();

      const parentModule = await newModule.findOne({ quizIds: quizId });
      if (parentModule) {
        await this.updateModuleTimestamp(parentModule._id.toString());
      }
      
      return quiz;
    } catch (error) {
      console.error(`Error updating quiz: ${error}`);
      return null;
    }
  }

  public async deleteQuiz(quizId: string, moduleId: string): Promise<boolean> {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(quizId) ||
        !mongoose.Types.ObjectId.isValid(moduleId)
      ) {
        console.error("Invalid quiz or module ID");
        return false;
      }

      const module = await newModule.findById(moduleId);
      if (!module) {
        console.error(`Module ${moduleId} not found`);
        return false;
      }

      const quiz = await Quiz.findById(quizId);
      if (quiz && quiz.questions && quiz.questions.length > 0) {
        console.log(
          `Deleting ${quiz.questions.length} questions from quiz ${quizId}`,
        );

        for (const questionId of quiz.questions) {
          await Question.findByIdAndDelete(questionId);
        }
      }

      module.quizIds = module.quizIds.filter((id) => id.toString() !== quizId);
      await module.save();

      await Quiz.findByIdAndDelete(quizId);

      return true;
    } catch (error) {
      console.error("Error deleting quiz:", error);
      return false;
    }
  }

  public async getQuestionById(questionId: string): Promise<IQuestion | null> {
    try {
      const question = await Question.findById(questionId).exec();
      return question;
    } catch (error) {
      console.error(`Error getting question: ${error}`);
      return null;
    }
  }

  public async addQuestionToQuiz(
    quizId: string,
    questionData: {
      question: string;
      options: string[];
      correctAnswer: string;
    },
  ): Promise<IQuestion> {
    try {
      const newQuestion = new Question({
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
      });

      const savedQuestion = await newQuestion.save();

      await Quiz.findByIdAndUpdate(quizId, {
        $push: { questions: savedQuestion._id },
      });

      return savedQuestion;
    } catch (error) {
      console.error(`Error adding question to quiz: ${error}`);
      throw error;
    }
  }

  public async updateQuestion(
    questionId: string,
    questionData: {
      question: string;
      options: string[];
      correctAnswer: string;
    },
  ): Promise<IQuestion | null> {
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return null;
    }

    const updated = await Question.findByIdAndUpdate(
      questionId,
      {
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
      },
      { new: true }
    )
    
    if (updated) {
      const parentQuiz = await Quiz.findOne({ questions: questionId });
      if (parentQuiz) {
        const parentModule = await newModule.findOne({ quizIds: parentQuiz._id });
        if (parentModule) {
          await this.updateModuleTimestamp(parentModule._id.toString());
        }
      }
    }

    return updated;
  }

  public async deleteQuestion(
    questionId: string,
    quizId: string,
  ): Promise<boolean> {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.error(`Quiz ${quizId} not found`);
      return false;
    }

    try {
      const deleted = await Question.findByIdAndDelete(questionId);
      if (!deleted) {
        console.error(`Question ${questionId} not found`);
        return false;
      }

      quiz.questions = quiz.questions.filter(
        (id) => id.toString() !== questionId,
      );
      await quiz.save();

      return true;
    } catch (error) {
      console.error("Error deleting question:", error);
      return false;
    }
  }

  //CRUD Methods for LINK support
  public async createLink(
    moduleId: string,
    title: string,
    link: string,
  ): Promise<boolean> {
    try {
      const module = await newModule.findById(moduleId);
      if (!module) {
        throw new Error("Module not found");
      }
      const newLink = new Link({ title, link });

      await newLink.save();
      module.linkIds.push(newLink._id);

      await module.save();
      return true;
    } catch (error) {
      console.error("Error creating link:", error);
      return false;
    }
  }

  public async getLinkById(id: string): Promise<ILink> {
    try {
      return await Link.findById(id);
    } catch (error) {
      console.error("Error reading link:", error);
      return null;
    }
  }

  public async updateLink(
    id: string,
    title: string,
    link: string,
  ): Promise<boolean> {
    try {
      const result = await Link.findByIdAndUpdate(id, { title, link }, { new: true });

      const parentModule = await newModule.findOne({ linkIds: id });
      if (parentModule) {
        await this.updateModuleTimestamp(parentModule._id.toString());
      }

      return !!result;
    } catch (error) {
      console.error("Error updating link:", error);
      return false;
    }
  }

  public async deleteLink(moduleId: string, linkId: string): Promise<boolean> {
    const module = await newModule.findById(moduleId);
    if (!module) {
      console.error(`Module ${moduleId} not found`);
      return false;
    }

    try {
      const deleted = await Link.findByIdAndDelete(linkId);
      if (!deleted) {
        console.error(`Link ${linkId} not found`);
        return false;
      }

      module.linkIds = module.linkIds.filter((id) => id.toString() !== linkId);
      await module.save();

      return true;
    } catch (error) {
      console.error("Error deleting link:", error);
      return false;
    }
  }

  private async updateModuleTimestamp(moduleId: string): Promise<void> {
    try {
      await newModule.findByIdAndUpdate(
        moduleId, 
        { $set: { updatedAt: new Date() } },
        { new: true }
      );
    } catch (error) {
      console.error("Error updating module timestamp:", error);
    }
  }

}
