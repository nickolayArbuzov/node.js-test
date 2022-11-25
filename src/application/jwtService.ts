import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJwt(id: string, deviceId: string, issuedAt: number){
        const accessToken = jwt.sign({userId: id}, process.env.JWT_SECRET || 'secret', {expiresIn:'10s'})
        const refreshToken = jwt.sign({userId: id, deviceId: deviceId, issuedAt: issuedAt}, process.env.JWT_SECRET || 'secret', {expiresIn:'20s'})
        return {accessToken: accessToken, refreshToken: refreshToken}
    },

    async getUserByAccessToken(token: string){
      try{
          const result: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
          return new ObjectId(result.userId)
      }
      catch(e){
          return null
      }
    }
}