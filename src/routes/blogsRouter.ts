import {Router} from "express";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/blogsController";
import { 
    blogNameValidation, 
    blogUrlValidation, 
    blogDescriptionValidation,
    inputValidationMiddleware, 
    postContentValidation, 
    postShortDescrValidation, 
    postTitleValidation 
} from "../middlewares/middleware";
import {
    authMiddleware, extractUserIdFromToken
} from '../middlewares/authGuard';
import { 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    searchNameTermSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
} from "../middlewares/sanitazers";

const blogsController = container.resolve(BlogsController)

export const blogsRouter = Router({})

blogsRouter.get('/', 
    searchNameTermSanitizer, 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        blogsController.find.bind(blogsController))

blogsRouter.post('/', 
    authMiddleware, 
    blogUrlValidation, 
    blogNameValidation, 
    blogDescriptionValidation,
    inputValidationMiddleware, 
        blogsController.create.bind(blogsController))

blogsRouter.post('/:id/posts', 
    authMiddleware, 
    postTitleValidation, 
    postShortDescrValidation, 
    postContentValidation, 
    inputValidationMiddleware, 
        blogsController.createPostByBlogId.bind(blogsController))

blogsRouter.get('/:id/posts', 
    extractUserIdFromToken,
    searchNameTermSanitizer, 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        blogsController.findPostByBlogId.bind(blogsController))

blogsRouter.get('/:id', 
    blogsController.findById.bind(blogsController))

blogsRouter.put('/:id', 
    authMiddleware, 
    blogNameValidation, 
    blogUrlValidation, 
    inputValidationMiddleware, 
        blogsController.update.bind(blogsController))

blogsRouter.delete('/:id', 
    authMiddleware, 
        blogsController.delete.bind(blogsController))
