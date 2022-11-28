import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import { DevicesService } from "../domain/devicesService";
import { jwtService } from "../application/jwtService";

@injectable()
export class DevicesController {
    constructor(@inject(DevicesService) protected devicesService: DevicesService) {
    }

    async findByCurrentUserId(req: Request, res: Response){
        const refreshToken = await jwtService.expandJwt(req.cookies.refreshToken)
        if(refreshToken) {
            const result = await this.devicesService.findByCurrentUserId(refreshToken.userId)
            res.send(result)
        } else {
            res.sendStatus(401)
        }
    }

    async delete(req: Request, res: Response){
        const refreshToken = await jwtService.expandJwt(req.cookies.refreshToken)
        if(refreshToken) {
            await this.devicesService.delete(refreshToken.userId, refreshToken.deviceId)
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }

    async deleteById(req: Request, res: Response){
        const refreshToken = await jwtService.expandJwt(req.cookies.refreshToken)
        if(refreshToken) {
            await this.devicesService.deleteById(refreshToken.deviceId)
            res.sendStatus(204)
        } else {
            res.sendStatus(401)
        }
    }
}