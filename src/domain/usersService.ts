import { injectable, inject } from "inversify";
import { UsersRepo } from "../repositories/usersRepo";
import { UserInputType } from "../types";
import bcrypt from 'bcrypt';

@injectable()
export class UsersService {
    constructor(@inject(UsersRepo) protected usersRepo: UsersRepo) {
    }

    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        return await this.usersRepo.find(searchLoginTerm, searchEmailTerm, pageNumber, pageSize, sortBy, sortDirection)
    }

    async findById(id: string){
        return await this.usersRepo.findById(id)
    }

    async create(login: string, password: string, email: string){

        const passwordSalt = await bcrypt.genSalt(8)
        const passwordHash = await bcrypt.hash(password, passwordSalt)

        /*const Salt = await bcrypt.genSalt()
        const Hash = await bcrypt.hash('superpassword', '$2a$10$Vn9PcYBKm2y0GeJK.Kzn6.')
        console.log('salt', Salt.length)
        console.log('hash', Hash)*/
        
        const user: UserInputType = {
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