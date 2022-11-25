import { injectable, inject } from "inversify";
import {Request, Response} from 'express'
import { DevicesService } from "../domain/devicesService";


@injectable()
export class DevicesController {
    constructor(@inject(DevicesService) protected devicesService: DevicesService) {
    }

    async findByCurrentUserId(req: Request, res: Response){
        const result = await this.devicesService.findByCurrentUserId(req.user?.id!)
        res.send(result)
    }

    async delete(req: Request, res: Response){
        const result = await this.devicesService.delete(req.user?.id!)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }

    async deleteById(req: Request, res: Response){
        const result = await this.devicesService.deleteById(req.params.id)
        if(result) {
            res.sendStatus(204)
        } else {
            res.sendStatus(404)
        }
    }
}