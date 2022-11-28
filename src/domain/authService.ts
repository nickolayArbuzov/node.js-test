import { injectable, inject } from "inversify";
import { devicesCollection, logCollection, userCollection } from "../repositories/db";
import bcrypt from 'bcrypt';
import { jwtService } from "../application/jwtService";
import { ObjectId } from "mongodb";
import { DeviceType, UserInputType } from "../types";
import { UsersRepo } from "../repositories/usersRepo";
import { v4 } from "uuid";
import { sendEmail } from "../adapters/mail.adapter";
import jwt from 'jsonwebtoken'
import { DevicesRepo } from "../repositories/devicesRepo";

@injectable()
export class AuthService {
    constructor(
        @inject(UsersRepo) protected usersRepo: UsersRepo,
        @inject(DevicesRepo) protected devicesRepo: DevicesRepo
    ) {}

    async login(loginOrEmail: string, password: string, ip: string, deviceName: string){

        const candidate = await this.usersRepo.findByLoginOrEmail(loginOrEmail)
        
        if(!candidate) {
            return false
        }
        const candidateHash = await bcrypt.hash(password, candidate.passwordSalt)
        //bcrypt.compare(password, )
        if(candidateHash === candidate.passwordHash && candidate) {
            const deviceId = v4()
            const device: DeviceType = {
                ip: ip,
                title: deviceName, 
                deviceId: deviceId,
                issuedAt: new Date().getTime(),
                expiresAt: new Date().getTime() + 20000,
                userId: candidate.id!.toString(),
            }
            const tokens = await jwtService.createJwt(candidate?.id?.toString() ? candidate?.id?.toString() : '', device.deviceId, device.issuedAt)
            
            await this.devicesRepo.create(device)
            return tokens
        } else {
            return false
        }
    }

    async refreshToken(refreshToken: string){
        const refresh = await jwtService.expandJwt(refreshToken)
        const issuedAt = new Date().getTime()
        const expiresAt = new Date().getTime() + 20000
        if(refresh && !refresh.revoke) {
            const tokens = await jwtService.createJwt(refresh.userId, refresh.deviceId, issuedAt)
            await devicesCollection.updateOne({deviceId: refresh.deviceId}, {$set: {issuedAt: issuedAt, expiresAt: expiresAt}})
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

    async logout(userId: string, deviceId: string){
        await devicesCollection.deleteOne({userId: userId, deviceId: deviceId})
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

