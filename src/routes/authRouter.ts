import {Router} from "express";
import { container } from "../composition-root";
import { AuthController } from "../controllers/authController";
import { jwtMiddleware } from "../middlewares/authGuard";
import { 
    inputValidationMiddleware,
    logger, userEmailValidation, userLoginValidation, userPasswordValidation, 
} from "../middlewares/middleware";

const authController = container.resolve(AuthController)

export const authRouter = Router({})

authRouter.post('/login', 
    logger,
        authController.login.bind(authController))

authRouter.post('/refresh-token', 
    logger,
        authController.refreshToken.bind(authController))

authRouter.post('/registration-confirmation', 
    logger,
        authController.registrationConfirmation.bind(authController))

authRouter.post('/registration', 
    logger,
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        authController.registration.bind(authController))

authRouter.post('/registration-email-resending', 
    logger,
        authController.registrationEmailResending.bind(authController))

authRouter.post('/logout', 
    logger,
        authController.logout.bind(authController))

authRouter.get('/me', 
    logger,
    jwtMiddleware,
        authController.getMe.bind(authController))
