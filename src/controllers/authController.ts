import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { AuthService } from "../domain/authService";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService: AuthService) {
    }

    async login(req: Request, res: Response){
        const auth = await this.authService.login(req.body.loginOrEmail, req.body.password)
        if(auth) {

            res.cookie('refreshToken', auth.refreshToken, {
                httpOnly: true,
                secure: true,
            });

            res.send({accessToken: auth.accessToken})
            
        } else {
            res.sendStatus(401)
        }
    }

    async refreshToken(req: Request, res: Response){
        const result = await this.authService.refreshToken(req.cookies.refreshToken)
        if(result) {
            res.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: true,
            });
            res.send({ accessToken: result.accessToken });
        } else {
            res.sendStatus(401)
        }        
    }

    async registrationConfirmation(req: Request, res: Response){
        await this.authService.registrationConfirmation(req.body.code)
        res.sendStatus(204)
    }

    async registration(req: Request, res: Response){
        await this.authService.registration(req.body.login, req.body.password, req.body.email)
        res.sendStatus(204)
    }

    async registrationEmailResending(req: Request, res: Response){
        await this.authService.registrationEmailResending(req.body.email)
        res.sendStatus(204)
    }

    async logout(req: Request, res: Response){
        const result = await this.authService.refreshToken(req.cookies.refreshToken)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
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