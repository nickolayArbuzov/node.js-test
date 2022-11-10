import {Router} from "express";
import { container } from "../composition-root";
import { UsersController } from "../controllers/usersController";
import { 
    authMiddleware, 
    inputValidationMiddleware, 
    logger,
    userEmailValidation,
    userLoginValidation,
    userPasswordValidation, 
} from "../middlewares/middleware";
import { 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    searchEmailTermSanitizer, 
    searchLoginTermSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer 
} from "../middlewares/sanitazers";

const usersController = container.resolve(UsersController)

export const usersRouter = Router({})

usersRouter.get('/', 
    logger,

    searchLoginTermSanitizer, 
    searchEmailTermSanitizer,
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        usersController.find.bind(usersController))

usersRouter.post('/', 
    logger,
    authMiddleware, 
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        usersController.create.bind(usersController))

usersRouter.delete('/:id', 
    logger,
    authMiddleware, 
        usersController.delete.bind(usersController))
