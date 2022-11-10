import {Router} from "express";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/blogsController";
import { 
    authMiddleware, 
    blogNameValidation, 
    blogUrlValidation, 
    inputValidationMiddleware, 
    logger, 
    postBlogIdValidation, 
    postContentValidation, 
    postShortDescrValidation, 
    postTitleValidation 
} from "../middlewares/middleware";
import { pageNumberSanitizer, pageSizeSanitizer, searchNameTermSanitizer, sortBySanitizer, sortDirectionSanitizer } from "../middlewares/sanitazers";

const blogsController = container.resolve(BlogsController)

export const usersRouter = Router({})

usersRouter.get('/', 
    logger,
    authMiddleware, 
    searchNameTermSanitizer, 
    pageNumberSanitizer, 
    pageSizeSanitizer, 
    sortBySanitizer, 
    sortDirectionSanitizer, 
        blogsController.find.bind(blogsController))

usersRouter.post('/', 
    logger,
    authMiddleware, 
    blogUrlValidation, 
    blogNameValidation, 
    inputValidationMiddleware, 
        blogsController.create.bind(blogsController))

usersRouter.delete('/:id', 
    logger,
    authMiddleware, 
        blogsController.delete.bind(blogsController))
