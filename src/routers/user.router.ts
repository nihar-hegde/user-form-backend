import express from "express";
import {
  createUserForm,
  getAllUserForms,
} from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/user-form", createUserForm);
userRouter.get("/all-user-form", getAllUserForms);

export default userRouter;
