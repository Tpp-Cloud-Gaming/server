import { Router } from "express";
import { UserController} from "../controllers/users.controller.js";

export const createUserRouter = () => {
    const router = Router()
    const userController = new UserController()

    router.get("/users",userController.getUsers);
    router.post("/users",userController.createUser);  
    
    return router
}