import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { PostsService } from "../domain/postsService";
import { jwtService } from "../application/jwtService";

@injectable()
export class PostsController {
    constructor(
        @inject(PostsService) protected postsService: PostsService, 
    ) {
    }

    async like(req: Request, res: Response){
        const result = await this.postsService.like(req.user!, req.body.likeStatus, req.params.id)
        res.sendStatus(result ? 204 : 404)
    }

    async findCommentbyPostId(req: Request, res: Response){
        const result = await this.postsService.findCommentbyPostId(req.params.id, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection, req.userId ? req.userId : '')
        if(result) {
            res.send(result)
        } else {
            res.sendStatus(404)
        }
    }

    async createCommentbyPostId(req: Request, res: Response){
        const post = await this.postsService.createCommentbyPostId(req.params.id, req.body.content, req.user?.id!, req.user?.login!)
        if(post) {
            res.status(201).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async find(req: Request, res: Response){
        const result = await this.postsService.find(+req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection, req.userId ? req.userId : '')
        res.send(result)
    }

    async create(req: Request, res: Response){
        const post = await this.postsService.create(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogId)
        res.status(201).send(post)
    }

    async findById(req: Request, res: Response){
        const post = await this.postsService.findById(req.params.id, req.userId ? req.userId : '')
        if(post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async update(req: Request, res: Response){
        const result = await this.postsService.update(req.params.id, req.body)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async delete(req: Request, res: Response){
        const result = await this.postsService.delete(req.params.id)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}