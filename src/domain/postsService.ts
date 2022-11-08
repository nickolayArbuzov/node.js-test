import { injectable, inject } from "inversify";
import { PostsRepo } from "../repositories/postsRepo";
import { Post } from "./entities/post";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepo) protected postsRepo: PostsRepo) {
    }

    async find(){
        return await this.postsRepo.find()
    }

    async create(title: string, shortDecription: string, content: string, blogId: string){
        const post = new Post(title, shortDecription, content, blogId)
        this.postsRepo.create(post)
    }

    async findById(id: string){
        return await this.postsRepo.findById(id)
    }

    async update(id: string, post: Post){
        return await this.postsRepo.update(id, post)
    }

    async delete(id: string){
        return await this.postsRepo.delete(id)
    }
}