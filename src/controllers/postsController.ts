import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { PostsService } from "../domain/postsService";

@injectable()
export class PostsController {
    constructor(@inject(PostsService) protected postsService: PostsService) {
    }

    async find(req: Request, res: Response){
        const result = await this.postsService.find()
        res.send(result)
    }

    async create(req: Request, res: Response){
        const post = await this.postsService.create(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId, req.body.blogId)
        res.status(201).send(post)
    }

    async findById(req: Request, res: Response){
        const post = await this.postsService.findById(req.params.id)
        if(post) {
            res.status(200).send(post)
        } else {
            res.sendStatus(404)
        }
    }

    async update(req: Request, res: Response){
        console.log('req', req.body)
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