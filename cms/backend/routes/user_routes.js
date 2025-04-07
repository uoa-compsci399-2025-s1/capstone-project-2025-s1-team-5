import { Router } from "express";
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../Controllers/userController.js";

const userRouter = Router();

userRouter.get('/users', getAllUsers);
userRouter.get('/users/:email', getUser);
userRouter.post('/users', createUser);
userRouter.put('/users/:email', updateUser);
userRouter.delete('/users/:email', deleteUser);

export default userRouter;