import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { UserType } from "../types";
import { userCollection } from "./db";

@injectable()
export class CommentsRepo {
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

    async create(user: UserType){
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