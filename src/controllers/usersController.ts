import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { UsersService } from "../domain/usersService";

@injectable()
export class UsersController {
    constructor(@inject(UsersService) protected usersService: UsersService) {
    }

    async find(req: Request, res: Response){
        const result = await this.usersService.find(req.query.searchLoginTerm!, req.query.searchEmailTerm!, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection)
        res.send(result)
    }

    async create(req: Request, res: Response){
        const user = await this.usersService.create(req.body.login, req.body.password, req.body.email)
        res.status(201).send(user)
    }

    async delete(req: Request, res: Response){
        const result = await this.usersService.delete(req.params.id)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}