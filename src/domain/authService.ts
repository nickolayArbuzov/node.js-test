import { injectable, inject } from "inversify";
import { userCollection } from "../repositories/db";
import bcrypt from 'bcrypt';

@injectable()
export class AuthService {
    constructor() {
    }

    async create(login: string, password: string){
        const candidate = await userCollection.findOne({login: login})
        if(!candidate) {
            return false
        }

        const candidateHash = await bcrypt.hash(password, candidate.passwordSalt)

        if(candidateHash === candidate.passwordHash) {
            return true
        } else {
            return false
        }
    }
}

