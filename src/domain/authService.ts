import { injectable, inject } from "inversify";
import { jwtCollection, logCollection, userCollection } from "../repositories/db";
import bcrypt from 'bcrypt';
import { jwtService } from "../application/jwtService";
import { ObjectId } from "mongodb";
import { UserInputType } from "../types";
import { UsersRepo } from "../repositories/usersRepo";
import { v4 } from "uuid";
import { sendEmail } from "../adapters/mail.adapter";
import jwt from 'jsonwebtoken'

@injectable()
export class AuthService {
    constructor(@inject(UsersRepo) protected usersRepo: UsersRepo) {
    }

    async login(loginOrEmail: string, password: string){
        const candidate = await this.usersRepo.findByLoginOrEmail(loginOrEmail)
        if(!candidate) {
            return false
        }
        const candidateHash = await bcrypt.hash(password, candidate.passwordSalt)
        //bcrypt.compare(password, )
        if(candidateHash === candidate.passwordHash && candidate) {
            const tokens = await jwtService.createJwt(candidate?.id?.toString() ? candidate?.id?.toString() : '')
            await jwtCollection.insertOne({userId: candidate.id, refreshToken: tokens.refreshToken, revoke: false})
            return tokens
        } else {
            return false
        }
    }

    async refreshToken(refreshToken: string){
        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET || 'secret')
        } catch(e) {
            return false
        }
        const refresh = await jwtCollection.findOne({refreshToken: refreshToken})
        const user = await this.usersRepo.findById(refresh?.userId)
        if(refresh && !refresh.revoke) {
            const tokens = await jwtService.createJwt(user?.id?.toString() ? user?.id?.toString() : '')
            await jwtCollection.insertOne({userId: user?.id, refreshToken: tokens.refreshToken, revoke: false})
            await jwtCollection.updateOne({_id: new ObjectId(refresh._id)}, {$set: {revoke: true}})
            logCollection.insertOne({tokens: tokens, date: new Date()})
            return tokens
        } else return false
    }

    async registrationConfirmation(code: string){
        return await this.usersRepo.activateUserByCode(code)
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
        await sendEmail(email, code, 'confirm-email')
    }

    async registrationEmailResending(email: string){
        const code = v4()
        await this.usersRepo.resendUserNewCode(email, code)
        await sendEmail(email, code, 'confirm-registration')
        return true
    }

    async logout(refreshToken: string){
        const refresh = await jwtCollection.findOne({refreshToken: refreshToken})
        if(refresh && !refresh.revoke) {
            await jwtCollection.updateOne({_id: new ObjectId(refresh._id)}, {$set: {revoke: true}})
        } else return false
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

