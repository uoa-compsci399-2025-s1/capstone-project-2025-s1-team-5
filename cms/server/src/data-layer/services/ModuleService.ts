import { moduleAdaptor } from "../adapter/ModuleAdapter";
import { IModule } from "../models/models";
import { newModule } from "../../data-layer/models/schema";
import mongoose from "mongoose";


export class ModuleService {
    static createModule: any;
    /**
     * 
     * @param moduleId 
     * @param data 
    //  */
    // public async createSubsectionForModule(id: string, data: { title: string; body: string; authorID: string }): Promise<SubsectionResponse> {
    //     const newSubsection = new Subsection({
    //        title: data.title,
    //        body: data.body,
    //        authorID: data.authorID,
    //     });
  
    //     await newSubsection.save();
  
    //     return {
    //        title: newSubsection.title,
    //        body: newSubsection.body,
    //        authorID: newSubsection.authorID,
    //        published: newSubsection.published,
    //     };
    //  }



    // /**
    //  * For future use when MVP is done
    //  * @param subsectionId 
    //  * @param fromModuleId 
    //  * @param toModuleId 
    //  * @returns 
    //  */
    // public async moveSubsectionToAnotherModule(
    //     subsectionId: string,
    //     fromModuleId: string,
    //     toModuleId: string
    //   ) {
    //     await Module.findByIdAndUpdate(fromModuleId, {
    //       $pull: { subsectionIds: subsectionId }
    //     });
    
    //     await Module.findByIdAndUpdate(toModuleId, {
    //       $push: { subsectionIds: subsectionId }
    //     });
    
    //     return { success: true };
    //   }

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
     * 
     * @param data 
     * @returns yes
     */
    public async createModule(data: Partial<IModule>): Promise<IModule> {
        const module = new newModule({
            title: data.title,
            description: data.description,
            subsectionIds: []
          });
      
          const saved = await module.save();
          return saved.toObject();
        }

    public async deleteModule(moduleId: string): Promise<boolean> {
        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            return false;
        }
        const deletedUser = await newModule.findByIdAndDelete(moduleId);
        return !!deletedUser;
    }
    public async updateModule(
        moduleId: string,
        moduleChanges: { title: string; description: string }
      ): Promise<boolean> {
        try {
          const module = await newModule.findById(moduleId);
    
          if (!module) {
            throw new Error("Module not found");
          }
          module.title = moduleChanges.title;
          module.description = moduleChanges.description;
    
          await module.save();
          return true;
        } catch (error) {
          console.error("Error updating module:", error);
          return false;
        }
      }
}