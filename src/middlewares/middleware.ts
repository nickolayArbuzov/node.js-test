import {NextFunction, Request, Response} from 'express'
import { validationResult, body, CustomValidator } from 'express-validator'
import { BlogsRepo } from '../repositories/blogsRepo';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers?.authorization?.split(' ')[1] === new Buffer('admin:qwerty').toString('base64') && req.headers?.authorization?.split(' ')[0] === 'Basic'){
        next()
    } else {
        res.sendStatus(401)
    }
}

const isValidUrl: CustomValidator = value => {
    if(!/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/.test(value)){
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
export const blogUrlValidation = body('youtubeUrl').custom(isValidUrl).isLength({min: 1, max: 100}).withMessage('field must be from 1 to 100 chars')
export const postTitleValidation = body('title').trim().isLength({min: 1, max: 30}).withMessage('field must be from 1 to 30 chars')
export const postShortDescrValidation = body('shortDescription').trim().isLength({min: 1, max: 100}).withMessage('field must be from 1 to 100 chars')
export const postContentValidation = body('content').trim().isLength({min: 1, max: 1000}).withMessage('field must be from 1 to 1000 chars')
export const postBlogIdValidation = body('blogId').trim().isLength({min: 1, max: 35}).withMessage('field must be string').custom(isBlogIdValid)
