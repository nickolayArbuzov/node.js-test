import { injectable, inject } from "inversify";
import bcrypt from 'bcrypt';
import { UsersRepo } from "../repositories/usersRepo";
import { UserType } from "../types";
import { CommentsRepo } from "../repositories/commentsRepo";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepo) protected commentsRepo: CommentsRepo) {
    }

    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.commentsRepo.find(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
    }

    async create(login: string, password: string, email: string){

        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        const user: UserType = {
            login: login,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            email: email,
            createdAt: new Date().toISOString(),
        }

        return this.commentsRepo.create(user)
    }

    async delete(id: string){
        return await this.commentsRepo.delete(id)
    }
}