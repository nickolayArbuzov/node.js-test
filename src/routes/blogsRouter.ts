import {Router} from "express";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/blogsController";
import { 
    blogNameValidation, 
    blogUrlValidation, 
    inputValidationMiddleware, 
    logger, 
    postBlogIdValidation, 
    postContentValidation, 
    postShortDescrValidation, 
    postTitleValidation 
} from "../middlewares/middleware";
import {
    authMiddleware
} from '../middlewares/authGuard';
import { pageNumberSanitizer, pageSizeSanitizer, searchNameTermSanitizer, sortBySanitizer, sortDirectionSanitizer } from "../middlewares/sanitazers";

const blogsController = container.resolve(BlogsController)

export const blogsRouter = Router({})

blogsRouter.get('/', 
    logger,
    searchNameTermSanitizer, 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        blogsController.find.bind(blogsController))

blogsRouter.post('/', 
    logger,
    authMiddleware, 
    blogUrlValidation, 
    blogNameValidation, 
    inputValidationMiddleware, 
        blogsController.create.bind(blogsController))

blogsRouter.post('/:id/posts', 
    logger,
    authMiddleware, 
    postTitleValidation, 
    postShortDescrValidation, 
    postContentValidation, 
    inputValidationMiddleware, 
        blogsController.createPostByBlogId.bind(blogsController))

blogsRouter.get('/:id/posts', 
    logger,
    searchNameTermSanitizer, 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        blogsController.findPostByBlogId.bind(blogsController))

blogsRouter.get('/:id', 
    logger,
    blogsController.findById.bind(blogsController))

blogsRouter.put('/:id', 
    logger,
    authMiddleware, 
    blogNameValidation, 
    blogUrlValidation, 
    inputValidationMiddleware, 
        blogsController.update.bind(blogsController))

blogsRouter.delete('/:id', 
    logger,
    authMiddleware, 
        blogsController.delete.bind(blogsController))
