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

export const authRouter = Router({})

authRouter.post('/login', 
    logger,
    blogUrlValidation, 
    blogNameValidation, 
    inputValidationMiddleware, 
        blogsController.create.bind(blogsController))


