import {Router} from "express";
import { container } from "../composition-root";
import { CommentsController } from "../controllers/commentsController";
import { 
    inputValidationMiddleware, 
    commentContentValidation,
} from "../middlewares/middleware";
import {
    jwtMiddleware
} from '../middlewares/authGuard';

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.get('/', 
        commentsController.find.bind(commentsController))

commentsRouter.get('/:id', 
        commentsController.findOne.bind(commentsController))

commentsRouter.put('/:id', 
    jwtMiddleware,
    commentContentValidation,
    inputValidationMiddleware, 
        commentsController.update.bind(commentsController))

commentsRouter.delete('/:id', 
    jwtMiddleware, 
        commentsController.delete.bind(commentsController))
