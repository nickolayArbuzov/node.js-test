import {Router} from "express";
import { container } from "../composition-root";
import { AuthController } from "../controllers/authController";
import { 
    logger, 
} from "../middlewares/middleware";

const authController = container.resolve(AuthController)

export const authRouter = Router({})

authRouter.post('/login', 
    logger,
        authController.create.bind(authController))


