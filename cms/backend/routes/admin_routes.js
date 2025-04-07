import { Router } from "express";
import {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from "../Controllers/adminController.js";

const adminRouter = Router();

adminRouter.get('/modules', getAllModules);
adminRouter.get('/modules/:moduleId', getModuleById);
adminRouter.post('/modules', createModule);
adminRouter.put('/modules/:moduleId', updateModule);
adminRouter.delete('/modules/:moduleId', deleteModule);

export default adminRouter;