import { injectable, inject } from "inversify";
import bcrypt from 'bcrypt';
import { CommentType } from "../types";
import { CommentsRepo } from "../repositories/commentsRepo";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepo) protected commentsRepo: CommentsRepo) {
    }

    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.commentsRepo.find(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
    }

    async update(login: string, password: string, email: string){

        /*const comment: CommentType = {
            
        }

        return this.commentsRepo.create(comment)*/
    }

    async delete(id: string){
        return await this.commentsRepo.delete(id)
    }
}