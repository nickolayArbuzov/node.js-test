import {Router} from "express";
import { container } from "../composition-root";
import { AuthController } from "../controllers/authController";
import { attemptsMiddleware } from "../middlewares/attempsGuard";
import { jwtMiddleware, refreshTokenMiddleware } from "../middlewares/authGuard";
import { 
    userEmailIsExistsValidation, 
    userLoginIsExistsValidation, 
    userCodeRegistrationIsValid, 
    userEmailConfirmValidation, 
} from "../middlewares/checkUserMiddleware";
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
    attemptsMiddleware,
        authController.login.bind(authController))

authRouter.post('/refresh-token', 
        authController.refreshToken.bind(authController))

authRouter.post('/registration-confirmation', 
    attemptsMiddleware,
    userCodeRegistrationIsValid,
    inputValidationMiddleware, 
        authController.registrationConfirmation.bind(authController))

authRouter.post('/registration', 
    attemptsMiddleware,
    userLoginIsExistsValidation,
    userEmailIsExistsValidation,
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        authController.registration.bind(authController))

authRouter.post('/registration-email-resending', 
    attemptsMiddleware,
    userEmailConfirmValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        authController.registrationEmailResending.bind(authController))

authRouter.post('/logout', 
    refreshTokenMiddleware,
        authController.logout.bind(authController))

authRouter.get('/me', 
    jwtMiddleware,
        authController.getMe.bind(authController))
