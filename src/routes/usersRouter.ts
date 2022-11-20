import {Router} from "express";
import { container } from "../composition-root";
import { UsersController } from "../controllers/usersController";
import { 
    inputValidationMiddleware, 
    userEmailValidation,
    userLoginValidation,
    userPasswordValidation, 
} from "../middlewares/middleware";
import {
    authMiddleware
} from '../middlewares/authGuard';
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
    authMiddleware, 
    searchLoginTermSanitizer, 
    searchEmailTermSanitizer,
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        usersController.find.bind(usersController))

usersRouter.post('/', 
    authMiddleware, 
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        usersController.create.bind(usersController))

usersRouter.delete('/:id', 
    authMiddleware, 
        usersController.delete.bind(usersController))
