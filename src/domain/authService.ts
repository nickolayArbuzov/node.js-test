import { injectable, inject } from "inversify";
import { userCollection } from "../repositories/db";
import bcrypt from 'bcrypt';
import { jwtService } from "../application/jwtService";
import { ObjectId } from "mongodb";
import { UserInputType } from "../types";
import { UsersRepo } from "../repositories/usersRepo";
import { v4 } from "uuid";
import { sendEmail } from "../adapters/mail.adapter";

@injectable()
export class AuthService {
    constructor(@inject(UsersRepo) protected usersRepo: UsersRepo) {
    }

    async login(login: string, password: string){
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

    async refreshToken(req: Request, res: Response){
        return true
    }

    async registrationConfirmation(req: Request, res: Response){
        return true
    }

    async registration(login: string, password: string, email: string){

        const passwordSalt = await bcrypt.genSalt(8)
        const passwordHash = await bcrypt.hash(password, passwordSalt)
        const code = v4()

        const user: UserInputType = {
            login: login,
            passwordHash: passwordHash,
            passwordSalt: passwordSalt,
            email: email,
            isActivated: false,
            code: code,
            createdAt: new Date().toISOString(),
        }

        await this.usersRepo.create(user)
        sendEmail(email, code)
    }

    async registrationEmailResending(req: Request, res: Response){
        return true
    }

    async logout(req: Request, res: Response){
        return true
    }

    async getMe(id: string){
        const user = await userCollection.findOne({_id: new ObjectId(id)})
        if(user){
            return {
                email: user.email,
                login: user.login,
                userId: user._id,
            }
        } else {
            return false
        }
    }
}

