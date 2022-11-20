import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { UserInputType } from "../types";
import { userCollection } from "./db";

@injectable()
export class UsersRepo {
    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        const users = await userCollection.find(
            {$or: [
                {"login": {$regex: searchLoginTerm, $options: 'i'}}, 
                {"email": {$regex: searchEmailTerm, $options: 'i'}}
            ]}
        )
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy] : sortDirection})
        .toArray()

        const totalCount = await userCollection.countDocuments(
            {$or: [
                {"login": {$regex: searchLoginTerm, $options: 'i'}}, 
                {"email": {$regex: searchEmailTerm, $options: 'i'}}
            ]}
        )

        const items = users.map(u => {
            return {
                id: u._id,
                login: u.login,
                email: u.email,
                createdAt: u.createdAt,
            }
        })

        return {    
            pagesCount: Math.ceil(totalCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items,
        }
    }

    async findById(id: string){
        const user = await userCollection.findOne({_id: new ObjectId(id)})
        if(user) {
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt,
            }
        } else {
            return null
        }
    }

    async findByLoginOrEmail(loginOrEmail: string){
        const user = await userCollection.findOne(
            {$or: [
                {"login": loginOrEmail},
                {"email": loginOrEmail}
            ]}
        )
        if (user) {
            //@ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        }
        return user
    }

    async findByCode(code: string){
        const user = await userCollection.findOne({"code": code})
        if(user){
            //@ts-ignore
            delete Object.assign(user, {["id"]: user["_id"] })["_id"];
        }
        return user
    }

    async updateUser(code: string){
        const user = await userCollection.updateOne({code: code}, {$set: {isActivated: true}})
        return user.matchedCount === 1
    }

    async create(user: UserInputType){
        await userCollection.insertOne(user)
        return {
            //@ts-ignore
            id: user._id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }
    }

    async delete(id: string){
        const result = await userCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}