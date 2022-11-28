import {NextFunction, Request, Response} from 'express'
import { validationResult, body, CustomValidator } from 'express-validator'
import { BlogsRepo } from '../repositories/blogsRepo';
import { logCollection } from '../repositories/db';
import { UsersRepo } from '../repositories/usersRepo';


export const logger = async (req: Request, res: Response, next: NextFunction) => {
    await logCollection.insertOne({cookie: req.cookies, url: req.originalUrl, date: new Date()})
    next()
}

const isValidUrl: CustomValidator = value => {
    if(!/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(value)){
        throw new Error('Invalid URL')
    }
    return true
};

const isValidEmail: CustomValidator = value => {
    if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)){
        throw new Error('Invalid URL')
    }
    return true
};

const isBlogIdValid: CustomValidator = async value => {
    const blogsRepo = new BlogsRepo()
    const flag = await blogsRepo.findById(value)
    if (!flag) {
        throw new Error('Invalid BlogID')
    }
    return true
}

const isCodeFromEmailValid: CustomValidator = async value => {
    const usersRepo = new UsersRepo()
    const flag = await usersRepo.findById(value)
    if (!flag) {
        throw new Error('Invalid BlogID')
    }
    return true
}
    
export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        res.status(400).send({errorsMessages: errors.array({onlyFirstError: true}).map(e => {
            return {message: e.msg, field: e.param}
        })})
    } else {
        next()
    }
}

export const blogNameValidation = body('name').trim().isLength({min: 1, max: 15}).withMessage('field must be from 1 to 15 chars')
export const blogUrlValidation = body('websiteUrl').custom(isValidUrl).isLength({min: 1, max: 100}).withMessage('field must be from 1 to 100 chars')
export const blogDescriptionValidation = body('description').isLength({min: 1, max: 500}).withMessage('field must be from 1 to 500 chars')

export const postTitleValidation = body('title').trim().isLength({min: 1, max: 30}).withMessage('field must be from 1 to 30 chars')
export const postShortDescrValidation = body('shortDescription').trim().isLength({min: 1, max: 100}).withMessage('field must be from 1 to 100 chars')
export const postContentValidation = body('content').trim().isLength({min: 1, max: 1000}).withMessage('field must be from 1 to 1000 chars')
export const postBlogIdValidation = body('blogId').trim().isLength({min: 1, max: 35}).withMessage('field must be string').custom(isBlogIdValid)

export const userLoginValidation = body('login').trim().isLength({min: 3, max: 10}).withMessage('field must be from 3 to 10 chars')
export const userPasswordValidation = body('password').trim().isLength({min: 6, max: 20}).withMessage('field must be from 6 to 20 chars')
export const userEmailValidation = body('email').custom(isValidEmail).withMessage('field must be email-format')

export const commentContentValidation = body('content').trim().isLength({min: 20, max: 300}).withMessage('field must be from 20 to 300 chars')

export const codeFromEmailValidation = body('code').custom(isCodeFromEmailValid).withMessage('code not correct')

export const newPasswordValidation = body('newPassword').trim().isLength({min: 6, max: 20}).withMessage('field must be from 6 to 20 chars')