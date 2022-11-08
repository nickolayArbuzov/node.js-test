import { injectable, inject } from "inversify";
import { BlogsRepo } from "../repositories/blogsRepo";
import { blogType } from "../types";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepo) protected blogsRepo: BlogsRepo) {
    }

    async find(){
        return await this.blogsRepo.find()
    }

    async create(name: string, youtubeUrl: string){
        const blog: blogType = {
            name: name,
            youtubeUrl: youtubeUrl,
            createdAt: new Date().toISOString()
        }
        return await this.blogsRepo.create(blog)
    }

    async findById(id: string){
        return await this.blogsRepo.findById(id)
    }

    async update(id: string, blog: blogType){
        return await this.blogsRepo.update(id, blog)
    }

    async delete(id: string){
        return await this.blogsRepo.delete(id)
    }
}