import {Router} from "express";
import { container } from "../composition-root";
import { PostsController } from "../controllers/postsController";
import { 
    commentContentValidation, 
    inputValidationMiddleware, 
    likesValidation, 
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

postsRouter.put('/:id/like-status', 
    jwtMiddleware,
    likesValidation,
    inputValidationMiddleware, 
        postsController.like.bind(postsController))

postsRouter.get('/:id/comments', 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        postsController.findCommentbyPostId.bind(postsController))

postsRouter.post('/:id/comments', 
    jwtMiddleware,
    commentContentValidation,
    inputValidationMiddleware, 
        postsController.createCommentbyPostId.bind(postsController))

postsRouter.get('/', 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        postsController.find.bind(postsController))

postsRouter.post('/', 
    authMiddleware, 
    postTitleValidation, 
    postShortDescrValidation, 
    postContentValidation, 
    postBlogIdValidation, 
    inputValidationMiddleware, 
        postsController.create.bind(postsController))

postsRouter.get('/:id', 
        postsController.findById.bind(postsController))

postsRouter.put('/:id', 
    authMiddleware, 
    postShortDescrValidation, 
    postTitleValidation, 
    postContentValidation, 
    postBlogIdValidation, 
    inputValidationMiddleware, 
        postsController.update.bind(postsController))

postsRouter.delete('/:id', 
    authMiddleware, 
        postsController.delete.bind(postsController))