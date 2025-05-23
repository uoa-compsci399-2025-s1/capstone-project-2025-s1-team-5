import { moduleAdaptor } from "../adapter/ModuleAdapter";
import type { IModule, IQuestion, IQuiz, ISubsection, LayoutConfig } from "../models/models";
import { newModule, Question, Quiz, Subsection } from "../../data-layer/models/schema";
import mongoose from "mongoose";

export class ModuleService {
    /**
     * Method to fetch all modules
     * @returns List of all modules
     */
    public async getAllModules(): Promise<IModule[]> {
        const fetchedModules = await newModule.find();
        return fetchedModules.map(moduleAdaptor);
      }

      public async getModule(moduleId: string): Promise<IModule | null> {
        try {
            const module = await newModule.findById(moduleId)
                .populate("subsectionIds")
                .exec();
            if (!module) {
                return null;
            }
            return module;
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
        const module = new newModule({
            title: data.title,
            subsectionIds: []
          });
      
          const saved = await module.save();
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

          if (module.subsectionIds.length > 0) {
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
    /**
     * Updates Module title and 
     * @param moduleId 
     * @param moduleChanges 
     * @returns 
     */
    public async updateModule(
        moduleId: string,
        moduleChanges: { title?: string; description?: string; subsectionIds?: string[] }
      ): Promise<boolean> {
        try {
          const module = await newModule.findById(moduleId);
    
          if (!module) {
            throw new Error("Module not found");
          }
          module.title = moduleChanges.title;
          module.subsectionIds = moduleChanges.subsectionIds?.map(id => new mongoose.Types.ObjectId(id));
    
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
      subsectionData: { title: string; body: string; authorID: string }
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
        const subsection = await Subsection.findById(subsectionId)
      if (!subsection) {
        throw new Error("Subsection Not Found")
      }
      return subsection
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
      quizData: {title: string, description: string}
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

  public async deleteQuiz(quizId: string, moduleId: string): Promise<boolean> {
    try {
      const module = await newModule.findById(moduleId)
      module.quizIds = module.quizIds.filter(
        (id) => id.toString() !== quizId
      );
      await Quiz.findByIdAndDelete(quizId)  
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
  public async addQuestionToQuiz(
    quizId: string,
    questionData: { question: string; options: string[]; correctAnswer: string }
  ): Promise<IQuestion | null> {
    // 1. Validate quizId
    if (!mongoose.Types.ObjectId.isValid(quizId)) {
      console.error(`Invalid quizId: ${quizId}`);
      return null;
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      console.error(`Quiz not found: ${quizId}`);
      return null;
    }

    const newQuestion = new Question({
      question: questionData.question,
      answers: questionData.options,   
      correctAnswer: questionData.correctAnswer,
    });
    await newQuestion.save();

    quiz.questions.push(newQuestion._id);
    await quiz.save();

    return newQuestion;
  }

  public async updateQuestion(
    questionId: string,
    questionData: { question: string; options: string[]; correctAnswer: string }
  ): Promise<IQuestion | null> {
    // Optionally validate questionId format
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return null;
    }

    const updated = await Question.findByIdAndUpdate(
      questionId,
      {
        question: questionData.question,
        answers: questionData.options,
        correctAnswer: questionData.correctAnswer
      },
      { new: true }
    )

    return updated;
  }
      
  public async deleteQuestion(questionId: string, quizId: string): Promise<boolean> {
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

      quiz.questions = quiz.questions.filter(id => id.toString() !== questionId);
      await quiz.save();

      return true;
    } catch (error) {
      console.error("Error deleting question:", error);
      return false;
    }
  }

  public async updateSubsectionLayout(
    subsectionId: string,
    layout: LayoutConfig
  ): Promise<boolean> {
    try {
      const sub = await Subsection.findById(subsectionId);
      if (!sub) {
        console.error(`Subsection ${subsectionId} not found`);
        return false;
      }
      sub.layout = layout;
      sub.updatedAt = new Date();
      await sub.save();
      return true;
    } catch (err) {
      console.error("Error updating layout:", err);
      return false;
    }
  }

  public async getSubsectionById(subsectionId: string): Promise<ISubsection> {
  const subsection = await Subsection.findById(subsectionId).lean();
  if (!subsection) throw new Error("Subsection Not Found");

  // 补默认
  if (!subsection.layout || !Array.isArray(subsection.layout.sections)) {
    subsection.layout = { sections: [] };
  }

  return subsection as ISubsection;
}
}
