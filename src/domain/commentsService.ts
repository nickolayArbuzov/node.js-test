import { injectable, inject } from "inversify";
import { CommentType } from "../types";
import { CommentsRepo } from "../repositories/commentsRepo";

@injectable()
export class CommentsService {
    constructor(
        @inject(CommentsRepo) protected commentsRepo: CommentsRepo
    ) {}

    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.commentsRepo.find(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
    }

    async findOne(id: string){
        return await this.commentsRepo.findOne(id)
    }

    async findOneByUserId(userId: string){
        return await this.commentsRepo.findOneByUserId(userId)
    }

    async update(commentId: string, comment: CommentType, userId: string){
        const candidatComment = this.commentsRepo.findOne(commentId)
        return this.commentsRepo.update(comment)
    }

    async delete(id: string){
        return await this.commentsRepo.delete(id)
    }
}