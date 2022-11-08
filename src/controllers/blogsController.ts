import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { BlogsService } from "../domain/blogsService";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) protected blogsService: BlogsService) {
    }

    async find(req: Request, res: Response){
        const result = await this.blogsService.find()
        res.send(result)
    }

    async create(req: Request, res: Response){
        const blog = await this.blogsService.create(req.body.name, req.body.youtubeUrl)
        res.status(201).send(blog)
    }

    async findById(req: Request, res: Response){
        this.blogsService.findById(req.params.id)
    }

    async update(req: Request, res: Response){
        this.blogsService.update(req.params.id, req.body)
    }

    async delete(req: Request, res: Response){
        this.blogsService.delete(req.params.id)
    }
}