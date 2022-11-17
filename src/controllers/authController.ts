import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { AuthService } from "../domain/authService";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService: AuthService) {
    }

    async login(req: Request, res: Response){
        const auth = await this.authService.login(req.body.login, req.body.password)
        if(auth) {
            res.send(auth)
        } else {
            res.sendStatus(401)
        }
    }

    async refreshToken(req: Request, res: Response){
        return true
    }

    async registrationConfirmation(req: Request, res: Response){
        return true
    }

    async registration(req: Request, res: Response){
        const result = await this.authService.registration(req.body.login, req.body.password, req.body.email)
        if(result){
            res.sendStatus(204)
        }
    }

    async registrationEmailResending(req: Request, res: Response){
        return true
    }

    async logout(req: Request, res: Response){
        return true
    }

    async getMe(req: Request, res: Response){
        const auth = await this.authService.getMe(req.user?.id!)
        if(auth) {
            res.send(auth)
        } else {
            res.sendStatus(401)
        }
    }
}