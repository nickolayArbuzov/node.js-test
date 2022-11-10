import {Router} from "express";
import { container } from "../composition-root";
import { CommentsController } from "../controllers/commentsController";
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

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.get('/', 
    logger,

    searchLoginTermSanitizer, 
    searchEmailTermSanitizer,
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        commentsController.find.bind(commentsController))

commentsRouter.post('/', 
    logger,
    authMiddleware, 
    userLoginValidation,
    userPasswordValidation,
    userEmailValidation,
    inputValidationMiddleware, 
        commentsController.create.bind(commentsController))

commentsRouter.delete('/:id', 
    logger,
    authMiddleware, 
        commentsController.delete.bind(commentsController))
