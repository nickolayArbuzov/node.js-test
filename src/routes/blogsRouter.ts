import {Router} from "express";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/blogsController";
import { 
    authMiddleware, 
    blogNameValidation, 
    blogUrlValidation, 
    inputValidationMiddleware, 
    postBlogIdValidation, 
    postContentValidation, 
    postShortDescrValidation, 
    postTitleValidation 
} from "../middlewares/middleware";
import { pageNumberSanitizer, pageSizeSanitizer, searchNameTermSanitizer, sortBySanitizer, sortDirectionSanitizer } from "../middlewares/sanitazers";

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
