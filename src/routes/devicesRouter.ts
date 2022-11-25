import {Router} from "express";
import { container } from "../composition-root";
import { DevicesController } from "../controllers/devicesController";
import { 
    inputValidationMiddleware, 
    userEmailValidation,
    userLoginValidation,
    userPasswordValidation, 
} from "../middlewares/middleware";
import {
    jwtMiddleware
} from '../middlewares/authGuard';

const devicesController = container.resolve(DevicesController)

export const devicesRouter = Router({})

devicesRouter.get('/', 
    jwtMiddleware,
        devicesController.findByCurrentUserId.bind(devicesController))

devicesRouter.delete('/', 
    jwtMiddleware,
        devicesController.delete.bind(devicesController))

devicesRouter.delete('/:id', 
    jwtMiddleware,
        devicesController.deleteById.bind(devicesController))
