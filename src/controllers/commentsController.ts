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

    async findOne(req: Request, res: Response){
        const result = await this.commentsService.findOne(req.params.id)
        if(result) {
            res.send(result)
        } else {
            res.sendStatus(404)
        }
    }

    async update(req: Request, res: Response){
        const candidatComment = await this.commentsService.findOneByUserId(req.user?.id!)
        if (candidatComment) {
            await this.commentsService.update(req.params.id, req.body, req.user?.id!)
            res.sendStatus(204)
        } else {
            res.sendStatus(403)
        }
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