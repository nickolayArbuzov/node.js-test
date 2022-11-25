import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { DeviceType } from "../types";
import { devicesCollection } from "./db";

@injectable()
export class DevicesRepo {

    async findByCurrentUserId(id: string){
        const devices = await devicesCollection.find({userId: id}).toArray()
        return devices.map(d => {
            return {
                ip: d.ip,
                title: d.title,
                lastActiveDate: new Date(d.issuedAt).toISOString(),
                deviceId: d._id.toString(),
            }
        })
    }

    async create(ip: string, title: string, deviceId: string, userId: string){
        const device: DeviceType = {
            ip: ip,
            title: title, 
            deviceId: deviceId,
            issuedAt: new Date().getTime(),
            expiresAt: new Date().getTime() + 20000,
            userId: userId,
        }
        await devicesCollection.insertOne(device)
        return true
    }

    async delete(userId: string){
        const result = await devicesCollection.deleteMany({_id: new ObjectId(userId)})
        return result.deletedCount === 1
    }

    async deleteById(deviceId: string){
        const result = await devicesCollection.deleteOne({_id: new ObjectId(deviceId)})
        return result.deletedCount === 1
    }
}