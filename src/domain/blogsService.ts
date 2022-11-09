import { injectable, inject } from "inversify";
import { BlogsRepo } from "../repositories/blogsRepo";
import { BlogType } from "../types";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepo) protected blogsRepo: BlogsRepo) {
    }

    async find(searchNameTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.blogsRepo.find(searchNameTerm, pageNumber, pageSize, sortBy, sortDirection)
    }

    async create(name: string, youtubeUrl: string){
        const blog: BlogType = {
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date().toISOString()
        }
        return await this.blogsRepo.create(blog)
    }

    async createPostByBlogId(id: string, body: {title: string, shortDescription: string, content: string}){
        return await this.blogsRepo.createPostByBlogId(id, body)
    }

    async findPostByBlogId(id: string, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.blogsRepo.findPostByBlogId(id, pageNumber, pageSize, sortBy, sortDirection)
    }

    async findById(id: string){
        return await this.blogsRepo.findById(id)
    }

    async update(id: string, blog: BlogType){
        return await this.blogsRepo.update(id, blog)
    }

    async delete(id: string){
        return await this.blogsRepo.delete(id)
    }
}