import {Router} from "express";
import { container } from "../composition-root";
import { BlogsController } from "../controllers/blogsController";
import { authMiddleware, blogNameValidation, blogUrlValidation, inputValidationMiddleware } from "../middlewares/middleware";

const blogsController = container.resolve(BlogsController)

export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.find.bind(blogsController))
blogsRouter.post('/', authMiddleware, blogUrlValidation, blogNameValidation, inputValidationMiddleware, blogsController.create.bind(blogsController))
blogsRouter.get('/:id', blogsController.findById.bind(blogsController))
blogsRouter.put('/:id', authMiddleware, blogNameValidation, blogUrlValidation, inputValidationMiddleware, blogsController.update.bind(blogsController))
blogsRouter.delete('/:id', authMiddleware, blogsController.delete.bind(blogsController))
