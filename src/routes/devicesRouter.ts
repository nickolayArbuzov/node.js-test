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
    logger,
    refreshTokenMiddleware,
        devicesController.findByCurrentUserId.bind(devicesController))

devicesRouter.delete('/', 
    logger,
    refreshTokenMiddleware,
        devicesController.delete.bind(devicesController))

devicesRouter.delete('/:id', 
    logger,
    refreshTokenMiddleware,
        devicesController.deleteById.bind(devicesController))
