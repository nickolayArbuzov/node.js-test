import {NextFunction, Request, Response} from 'express'
import { inject, injectable } from 'inversify';
import {jwtService} from "../application/jwtService";
import { container } from '../composition-root';
import {UsersService} from "../domain/usersService";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers?.authorization?.split(' ')[1] === new Buffer('admin:qwerty').toString('base64') && req.headers?.authorization?.split(' ')[0] === 'Basic'){
        next()
    } else {
        res.sendStatus(401)
    }
}

export const jwtMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.sendStatus(401)
        return
    }
    const token = req.headers.authorization.split(' ')[1]
    const refreshToken = await jwtService.expandJwt(token);
    if(!refreshToken){
        res.sendStatus(401)
        return
    }
    const userService = container.resolve(UsersService)
    req.user = await userService.findById(refreshToken.userId);
    next()
}

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
        res.sendStatus(401)
        return
    }
    next()
}

/*@injectable
class joinMw {
    constructor(@inject jwtService: JWTService, @inject userService: UsersService){}

    authMiddleware  (req: Request, res: Response, next: NextFunction)  {
        if (req.headers?.authorization?.split(' ')[1] === new Buffer('admin:qwerty').toString('base64') && req.headers?.authorization?.split(' ')[0] === 'Basic'){
            next()
        } else {
            res.sendStatus(401)
        }
       async jwtMiddleware   (req: Request, res: Response, next: NextFunction)  {
            const userService = container.resolve(UsersService)
            if(!req.headers.authorization){
                res.send(401)
                return
            }
            const token = req.headers.authorization.split(' ')[1]
        
            const refreshToken = await jwtService.expandJwt(token);
        
            if(!refreshToken.userId){
                res.send(401)
                return
            }
            req.user = await userService.findById(!refreshToken.userId.toString());
            next()
        }
}*/