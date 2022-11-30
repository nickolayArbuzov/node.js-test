import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { BlogsService } from "../domain/blogsService";

@injectable()
export class BlogsController {
    constructor(@inject(BlogsService) protected blogsService: BlogsService) {
    }

    async find(req: Request, res: Response){
        const result = await this.blogsService.find(req.query.searchNameTerm!, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection)
        res.send(result)
    }

    async create(req: Request, res: Response){
        const blog = await this.blogsService.create(req.body.name, req.body.description, req.body.websiteUrl)
        res.status(201).send(blog)
    }

    async createPostByBlogId(req: Request, res: Response){
        const result = await this.blogsService.createPostByBlogId(req.params.id, req.body)
        if (result) {
            res.status(201).send(result)
        } else {
            res.sendStatus(404)
        }
    }

    async findPostByBlogId(req: Request, res: Response){
        const result = await this.blogsService.findPostByBlogId(req.params.id, +req.query.pageNumber!, +req.query.pageSize!, req.query.sortBy, req.query.sortDirection, req.userId ? req.userId : '')
        if (result) {
            res.status(200).send(result)
        } else {
            res.sendStatus(404)
        }
    }
 
    async findById(req: Request, res: Response){
        const blog = await this.blogsService.findById(req.params.id)
        if(blog) {
            res.status(200).send(blog)
        } else {
            res.sendStatus(404)
        }
    }

    async update(req: Request, res: Response){
        const result = await this.blogsService.update(req.params.id, req.body)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async delete(req: Request, res: Response){
        const result = await this.blogsService.delete(req.params.id)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}