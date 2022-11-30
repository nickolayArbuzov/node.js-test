import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { CommentsService } from "../domain/commentsService";
import { jwtService } from "../application/jwtService";

@injectable()
export class CommentsController {
    constructor(@inject(CommentsService) protected commentsService: CommentsService) {
    }

    async like(req: Request, res: Response){
        const result = await this.commentsService.like(req.user!, req.body.likeStatus, req.params.id)
        res.sendStatus(result ? 204 : 404)
    }

    async find(req: Request, res: Response){
        const result = await this.commentsService.find(req.query.searchLoginTerm!, req.query.searchEmailTerm!, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection)
        res.send(result)
    }

    async findOne(req: Request, res: Response){
        const result = await this.commentsService.findOne(req.params.id, req.user?.id)
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