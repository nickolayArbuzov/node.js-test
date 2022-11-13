import {Router} from "express";
import { container } from "../composition-root";
import { CommentsController } from "../controllers/commentsController";
import { 
    inputValidationMiddleware, 
    logger,
    commentContentValidation,
} from "../middlewares/middleware";
import {
    jwtMiddleware
} from '../middlewares/authGuard';

const commentsController = container.resolve(CommentsController)

export const commentsRouter = Router({})

commentsRouter.get('/:id', 
    logger,
        commentsController.find.bind(commentsController))

commentsRouter.put('/:', 
    logger,
    jwtMiddleware,
    commentContentValidation,
    inputValidationMiddleware, 
        commentsController.create.bind(commentsController))

commentsRouter.delete('/:id', 
    logger,
    jwtMiddleware, 
        commentsController.delete.bind(commentsController))
