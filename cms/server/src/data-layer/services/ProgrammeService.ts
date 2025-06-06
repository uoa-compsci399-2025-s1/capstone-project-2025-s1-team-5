import { IProgramme } from "../models/models";
import { Programme } from "../models/schema";

export class ProgrammeService {
  public async getAllProgrammes(): Promise<IProgramme[]> {
    try {
      const programmes = await Programme.find();
      return programmes;
    } catch (error) {
      throw new Error("Failed to fetch programmes");
    }
  }

  public async createProgramme(
    name: string,
    description: string,
    link: string,
  ): Promise<IProgramme> {
    try {
      const programme = new Programme({
        name,
        description,
        link,
      });

      const savedProgramme = await programme.save();
      return savedProgramme;
    } catch (error) {
      throw new Error("Failed to create programme");
    }
  }

  public async updateProgrammeById(
    id: string,
    updates: Partial<IProgramme>,
  ): Promise<IProgramme | null> {
    try {
      const updatedProgramme = await Programme.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return updatedProgramme;
    } catch (error) {
      throw new Error("Failed to update programme");
    }
  }

  public async deleteProgrammeById(id: string): Promise<boolean> {
    try {
      const result = await Programme.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error("Failed to delete programme");
    }
  }
}
