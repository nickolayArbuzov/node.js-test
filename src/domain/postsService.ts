import { injectable, inject } from "inversify";
import { CommentsRepo } from "../repositories/commentsRepo";
import { LikesRepo } from "../repositories/likesRepo";
import { PostsRepo } from "../repositories/postsRepo";
import { CommentType, PostType, UserViewType } from "../types";

@injectable()
export class PostsService {
    constructor(
        @inject(PostsRepo) protected postsRepo: PostsRepo,
        @inject(CommentsRepo) protected сommentsRepo: CommentsRepo,
        @inject(LikesRepo) protected likesRepo: LikesRepo
    ) {}

    async like(user: UserViewType, likeStatus: string, postId: string){
        const post = await this.postsRepo.findById(postId)
        if (post) {
            return await this.likesRepo.like(user, likeStatus, postId, null)
        }
        return post
    }

    async findCommentbyPostId(id: string, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any, userId = ''){
        const candidatPost = await this.postsRepo.findById(id)
        if(candidatPost) {
            return await this.сommentsRepo.findCommentbyPostId(id, pageNumber, pageSize, sortBy, sortDirection, userId)
        }   
        return false
    }

    async createCommentbyPostId(id: string, content: string, userId: string, userLogin: string){
        const candidatPost = await this.postsRepo.findById(id)
        if(candidatPost) {
            const comment: CommentType = {
                content: content,
                userId: userId,
                userLogin: userLogin,
                postId: id,
                createdAt: new Date().toISOString(),
            }
            return await this.сommentsRepo.createCommentbyPostId(comment)
        }  
        return false
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