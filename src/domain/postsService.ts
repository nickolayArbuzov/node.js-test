import { injectable, inject } from "inversify";
import { PostsRepo } from "../repositories/postsRepo";
import { postType } from "../types";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepo) protected postsRepo: PostsRepo) {
    }

    async find(){
        return await this.postsRepo.find()
    }

    async create(title: string, shortDescription: string, content: string, blogId: string, blogName: string){

        const post: postType = {
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

    async update(id: string, post: postType){
        return await this.postsRepo.update(id, post)
    }

    async delete(id: string){
        return await this.postsRepo.delete(id)
    }
}