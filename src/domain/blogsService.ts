import { injectable, inject } from "inversify";
import { BlogsRepo } from "../repositories/blogsRepo";
import { CreateBlog, UpdateBlog } from "./entities/blog";

@injectable()
export class BlogsService {
    constructor(@inject(BlogsRepo) protected blogsRepo: BlogsRepo) {
    }

    async find(){
        return await this.blogsRepo.find()
    }

    async create(name: string, youtubeUrl: string){
        const blog = new CreateBlog(name, youtubeUrl)
        this.blogsRepo.create(blog)
    }

    async findById(id: string){
        return await this.blogsRepo.findById(id)
    }

    async update(id: string, blog: UpdateBlog){
        return await this.blogsRepo.update(id, blog)
    }

    async delete(id: string){
        return await this.blogsRepo.delete(id)
    }
}