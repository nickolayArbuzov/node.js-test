import { injectable, inject } from "inversify";
import { userCollection } from "../repositories/db";
import bcrypt from 'bcrypt';
import { jwtService } from "../application/jwtService";

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
//bcrypt.compare(password, )
        if(candidateHash === candidate.passwordHash && candidate) {
            return jwtService.createJwt(candidate._id.toString())
        } else {
            return false
        }
    }
}

