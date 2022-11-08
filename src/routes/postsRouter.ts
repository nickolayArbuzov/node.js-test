import {Router} from "express";
import { container } from "../composition-root";
import { PostsController } from "../controllers/postsController";
import { postBlogIdValidation, postContentValidation, postShortDescrValidation, postTitleValidation } from "../middlewares/middleware";

const postsController = container.resolve(PostsController)

export const postsRouter = Router({})

postsRouter.get('/', postsController.find.bind(postsController))
postsRouter.post('/', postTitleValidation, postShortDescrValidation, postContentValidation, postBlogIdValidation, postsController.create.bind(postsController))
postsRouter.get('/:id', postsController.findById.bind(postsController))
postsRouter.put('/:id', postTitleValidation, postShortDescrValidation, postContentValidation, postBlogIdValidation, postsController.update.bind(postsController))
postsRouter.delete('/:id', postsController.delete.bind(postsController))