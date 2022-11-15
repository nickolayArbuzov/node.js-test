import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { AuthService } from "../domain/authService";

@injectable()
export class AuthController {
    constructor(@inject(AuthService) protected authService: AuthService) {
    }

    async create(req: Request, res: Response){
        const auth = await this.authService.create(req.body.login, req.body.password)
        if(auth) {
            res.send(auth)
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