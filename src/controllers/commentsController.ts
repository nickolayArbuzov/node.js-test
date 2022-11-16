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
        const candidatComment = await this.commentsService.findOne(req.params.id)
        if (candidatComment) {
            if(candidatComment.userId !== req.user?.id){
                res.sendStatus(403)
            } else {
                await this.commentsService.update(req.params.id, req.body)
                res.sendStatus(204)
            }
        } else {
            res.sendStatus(404)
        }
    }

    async delete(req: Request, res: Response){
        const candidatComment = await this.commentsService.findOne(req.params.id)
        if (candidatComment) {
            if(candidatComment.userId !== req.user?.id){
                res.sendStatus(403)
            } else {
                await this.commentsService.delete(req.params.id)
                res.sendStatus(204)
            }
        } else {
            res.sendStatus(404)
        }
    }
}