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
                deviceId: d.deviceId,
            }
        })
    }

    async delete(userId: string, deviceId: string){
        const result = await devicesCollection.deleteMany({userId: userId, deviceId: {$ne: deviceId}})
        return result.deletedCount === 1
    }

    async deleteById(deviceId: string){
        const result = await devicesCollection.deleteOne({deviceId: deviceId})
        return result.deletedCount === 1
    }

    async create(device: DeviceType){
        await devicesCollection.insertOne(device)
        return true
    }

    async findById(deviceId: string){
        const device = await devicesCollection.findOne({deviceId: deviceId})
        return device
    }
}