import { injectable, inject } from "inversify";
import { PostsRepo } from "../repositories/postsRepo";
import { PostType } from "../types";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepo) protected postsRepo: PostsRepo) {
    }

    async find(pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.postsRepo.find(pageNumber, pageSize, sortBy, sortDirection)
    }

    async create(title: string, shortDescription: string, content: string, blogId: string, blogName: string){

        const post: PostType = {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId,
            blogName: blogName,
            createdAt: new Date().toISOString()
        }
        return await this.postsRepo.create(post)
    }

    async findById(id: string){
        return await this.postsRepo.findById(id)
    }

    async update(id: string, post: PostType){
        return await this.postsRepo.update(id, post)
    }

    async delete(id: string){
        return await this.postsRepo.delete(id)
    }
}