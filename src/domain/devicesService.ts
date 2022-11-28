import { injectable, inject } from "inversify";
import bcrypt from 'bcrypt';
import { UserInputType } from "../types";
import { DevicesRepo } from "../repositories/devicesRepo";

@injectable()
export class DevicesService {
    constructor(@inject(DevicesRepo) protected devicesRepo: DevicesRepo) {
    }

    async findByCurrentUserId(userId: string){
        return await this.devicesRepo.findByCurrentUserId(userId)
    }

    async delete(userId: string, deviceId: string){
        return await this.devicesRepo.delete(userId, deviceId)
    }

    async deleteById(deviceId: string){
        return await this.devicesRepo.deleteById(deviceId)
    }

}