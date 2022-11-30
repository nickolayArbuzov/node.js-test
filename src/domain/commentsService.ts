import { injectable, inject } from "inversify";
import { CommentType, UserViewType } from "../types";
import { CommentsRepo } from "../repositories/commentsRepo";
import { LikesRepo } from "../repositories/likesRepo";

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepo) protected commentsRepo: CommentsRepo,
        @inject(LikesRepo) protected likesRepo: LikesRepo
    ) {}

    async like(user: UserViewType, likeStatus: string, commentId: string){
        const comment = await this.commentsRepo.findOne(commentId)
        if (comment) {
            return await this.likesRepo.like(user, likeStatus, null, commentId)
        }
        return comment
    }

    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.commentsRepo.find(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
    }

    async findOne(id: string, userId = ''){
  
        const comment = await this.commentsRepo.findOne(id)
        const likesInfo = await this.likesRepo.getLikesInfoForComment(id, userId)
        return {
            ...comment,
            likesInfo: likesInfo,
        }
    }

    async findOneByUserId(userId: string){
        return await this.commentsRepo.findOneByUserId(userId)
    }

    async update(commentId: string, comment: CommentType){
        return await this.commentsRepo.update(commentId, comment)
    }

    async delete(id: string){
        return await this.commentsRepo.delete(id)
    }
}