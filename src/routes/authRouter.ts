import {Router} from "express";
import { container } from "../composition-root";
import { AuthController } from "../controllers/authController";
import { jwtMiddleware } from "../middlewares/authGuard";
import { userEmailIsExistsValidation, userLoginIsExistsValidation, userCodeRegistrationIsValid, userEmailConfirmValidation } from "../middlewares/checkUserMiddleware";
import { 
    inputValidationMiddleware,
    logger,
    userEmailValidation, 
    userLoginValidation, 
    userPasswordValidation, 
} from "../middlewares/middleware";

const authController = container.resolve(AuthController)

export const authRouter = Router({})
authRouter.use(logger)
authRouter.post('/login', 
        authController.login.bind(authController))

authRouter.post('/refresh-token', 
        authController.refreshToken.bind(authController))

authRouter.post('/registration-confirmation', 
    userCodeRegistrationIsValid,
    inputValidationMiddleware, 
        authController.registrationConfirmation.bind(authController))

authRouter.post('/registration', 
    userLoginIsExistsValidation,
    userEmailIsExistsValidation,
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        authController.registration.bind(authController))

authRouter.post('/registration-email-resending', 
    userEmailConfirmValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        authController.registrationEmailResending.bind(authController))

authRouter.post('/logout', 
        authController.logout.bind(authController))

authRouter.get('/me', 
    jwtMiddleware,
        authController.getMe.bind(authController))
