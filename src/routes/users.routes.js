import { Router } from "express";
import {body, validationResult } from "express-validator";
import { UserController} from "../controllers/users.controller.js";


const validateCreateUser = [
    body('email').notEmpty().withMessage('Email is required').bail().isEmail().withMessage('Invalid Email')];

export const createUserRouter = () => {
    const router = Router()
    const userController = new UserController()

    router.get("/users",userController.getUsers);


    router.post("/users",validateCreateUser,async (req,res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        await userController.createUser(req,res);
            
    });  
    
    return router
}