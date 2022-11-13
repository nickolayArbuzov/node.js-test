import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { CommentsService } from "../domain/commentsService";

@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) protected commentsService: CommentsService) {
    }

    async find(req: Request, res: Response){
        const result = await this.commentsService.find(req.query.searchLoginTerm!, req.query.searchEmailTerm!, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection)
        res.send(result)
    }

    async create(req: Request, res: Response){
        /*const user = await this.commentsService.create()
        res.status(201).send(user)*/
    }

    async delete(req: Request, res: Response){
        const result = await this.commentsService.delete(req.params.id)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}