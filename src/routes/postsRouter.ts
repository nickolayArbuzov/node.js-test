import {Router} from "express";
import { container } from "../composition-root";
import { PostsController } from "../controllers/postsController";
import { 
    commentContentValidation, 
    inputValidationMiddleware, 
    logger, 
    postBlogIdValidation, 
    postContentValidation, 
    postShortDescrValidation, 
    postTitleValidation 
} from "../middlewares/middleware";
import {
    authMiddleware,
    jwtMiddleware
} from '../middlewares/authGuard';
import { pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer, sortDirectionSanitizer } from "../middlewares/sanitazers";

const postsController = container.resolve(PostsController)

export const postsRouter = Router({})

postsRouter.get('/:id/comments', 
    logger, 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        postsController.findCommentbyPostId.bind(postsController))

postsRouter.post('/:id/comments', 
    logger, 
    jwtMiddleware,
    commentContentValidation,
        postsController.createCommentbyPostId.bind(postsController))

postsRouter.get('/', 
    logger, 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        postsController.find.bind(postsController))

postsRouter.post('/', 
    logger, 
    authMiddleware, 
    postTitleValidation, 
    postShortDescrValidation, 
    postContentValidation, 
    postBlogIdValidation, 
    inputValidationMiddleware, 
        postsController.create.bind(postsController))

postsRouter.get('/:id', 
    logger, 
        postsController.findById.bind(postsController))

postsRouter.put('/:id', 
    logger, 
    authMiddleware, 
    postShortDescrValidation, 
    postTitleValidation, 
    postContentValidation, 
    postBlogIdValidation, 
    inputValidationMiddleware, 
        postsController.update.bind(postsController))

postsRouter.delete('/:id', 
    logger, 
    authMiddleware, 
        postsController.delete.bind(postsController))