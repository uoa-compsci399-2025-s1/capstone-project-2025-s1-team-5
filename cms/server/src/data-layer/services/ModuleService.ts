import { moduleAdaptor } from "../adapter/ModuleAdapter";
import { IModule } from "../models/models";
import { newModule } from "../../data-layer/models/schema";

export class ModuleService {
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
}