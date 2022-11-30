import {Router} from "express";
import { container } from "../composition-root";
import { DevicesController } from "../controllers/devicesController";
import { 
    inputValidationMiddleware, 
    logger, 
    userEmailValidation,
    userLoginValidation,
    userPasswordValidation, 
} from "../middlewares/middleware";
import {
    refreshTokenMiddleware
} from '../middlewares/authGuard';

const devicesController = container.resolve(DevicesController)

export const devicesRouter = Router({})

devicesRouter.get('/', 
    refreshTokenMiddleware,
        devicesController.findByCurrentUserId.bind(devicesController))

devicesRouter.delete('/', 
    refreshTokenMiddleware,
        devicesController.delete.bind(devicesController))

devicesRouter.delete('/:id', 
    refreshTokenMiddleware,
        devicesController.deleteById.bind(devicesController))
