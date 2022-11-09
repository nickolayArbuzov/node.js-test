import {Router} from "express";
import { container } from "../composition-root";
import { PostsController } from "../controllers/postsController";
import { authMiddleware, inputValidationMiddleware, postBlogIdValidation, postContentValidation, postShortDescrValidation, postTitleValidation } from "../middlewares/middleware";
import { pageNumberSanitizer, pageSizeSanitizer, searchNameTermSanitizer, sortBySanitizer, sortDirectionSanitizer } from "../middlewares/sanitazers";

const postsController = container.resolve(PostsController)

export const postsRouter = Router({})

postsRouter.get('/', pageNumberSanitizer, pageSizeSanitizer, sortBySanitizer, sortDirectionSanitizer, postsController.find.bind(postsController))
postsRouter.post('/', authMiddleware, postTitleValidation, postShortDescrValidation, postContentValidation, postBlogIdValidation, inputValidationMiddleware, postsController.create.bind(postsController))
postsRouter.get('/:id', postsController.findById.bind(postsController))
postsRouter.put('/:id', authMiddleware, postShortDescrValidation, postTitleValidation, postContentValidation, postBlogIdValidation, inputValidationMiddleware, postsController.update.bind(postsController))
postsRouter.delete('/:id', authMiddleware, postsController.delete.bind(postsController))