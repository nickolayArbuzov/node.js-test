import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";

export const jwtService = {
    async createJwt(id: string){
        const token = jwt.sign({userId: id}, process.env.JWT_SECRET || 'secret', {expiresIn:'24h'})
        return {accessToken: token}
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