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
        res.send({})
    }

    async registrationConfirmation(req: Request, res: Response){
        res.send({})
    }

    async registration(req: Request, res: Response){
        await this.authService.registration(req.body.login, req.body.password, req.body.email)
        res.sendStatus(204)
    }

    async registrationEmailResending(req: Request, res: Response){
        res.send({})
    }

    async logout(req: Request, res: Response){
        res.send({})
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