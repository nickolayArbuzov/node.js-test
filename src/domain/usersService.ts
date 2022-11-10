import { injectable, inject } from "inversify";
import { UsersRepo } from "../repositories/usersRepo";
import { UserType } from "../types";
import bcrypt from 'bcrypt';

@injectable()
export class UsersService {
    constructor(@inject(UsersRepo) protected usersRepo: UsersRepo) {
    }

    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.usersRepo.find(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
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

        return this.usersRepo.create(user)
    }

    async delete(id: string){
        return await this.usersRepo.delete(id)
    }
}