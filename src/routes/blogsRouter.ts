import {Router} from "express";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/blogsController";
import { blogNameValidation, blogUrlValidation, inputValidationMiddleware } from "../middlewares/middleware";

const blogsController = container.resolve(BlogsController)

export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.find.bind(blogsController))
blogsRouter.post('/', blogNameValidation, blogUrlValidation, inputValidationMiddleware, blogsController.create.bind(blogsController))
blogsRouter.get('/:id', blogsController.findById.bind(blogsController))
blogsRouter.put('/:id', blogNameValidation, blogUrlValidation, inputValidationMiddleware, blogsController.update.bind(blogsController))
blogsRouter.delete('/:id', blogsController.delete.bind(blogsController))
