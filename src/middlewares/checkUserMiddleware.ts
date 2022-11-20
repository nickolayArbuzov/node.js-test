import {NextFunction, Request, Response} from 'express'
import { validationResult, body, CustomValidator } from 'express-validator'
import { UsersRepo } from '../repositories/usersRepo';

const isUserExist: CustomValidator = async value => {
    const usersRepo = new UsersRepo()
    const user = await usersRepo.findByLoginOrEmail(value)
    if (user) {
        throw new Error('User already exists')
    }
    return true
}

const isCodeValid: CustomValidator = async value => {
    const usersRepo = new UsersRepo()
    const user = await usersRepo.findByCode(value)
    if (!user || user.isActivated) {
        throw new Error('Code incorrect')
    }
    return true
}

const isMailValid: CustomValidator = async value => {
    const usersRepo = new UsersRepo()
    const user = await usersRepo.findByLoginOrEmail(value)
    if (!user || user.isActivated) {
        throw new Error('Mail incorrect')
    }
    return true
}

export const userLoginIsExistsValidation = body('login').trim().isLength({min: 1}).withMessage('incorrect field').custom(isUserExist)
export const userEmailIsExistsValidation = body('email').trim().isLength({min: 1}).withMessage('incorrect field').custom(isUserExist)

export const userCodeRegistrationIsValid = body('code').trim().isLength({min: 1}).withMessage('incorrect field').custom(isCodeValid)

export const userEmailConfirmValidation = body('email').trim().isLength({min: 1}).withMessage('incorrect field').custom(isMailValid)