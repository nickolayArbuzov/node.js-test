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
        this.postsService.create(req.body.title, req.body.shortDecription, req.body.content, req.body.blogId)
    }

    async findById(req: Request, res: Response){
        this.postsService.findById(req.params.id)
    }

    async update(req: Request, res: Response){
        this.postsService.update(req.params.id, req.body)
    }

    async delete(req: Request, res: Response){
        this.postsService.delete(req.params.id)
    }
}