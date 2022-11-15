import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { CommentType } from "../types";
import { commentCollection } from "./db";

@injectable()
export class CommentsRepo {
    async find(searchLoginTerm: any, searchEmailTerm: any, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        const users = await commentCollection.find(
            {$or: [
                {"login": {$regex: searchLoginTerm, $options: 'i'}}, 
                {"email": {$regex: searchEmailTerm, $options: 'i'}}
            ]}
        )
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy] : sortDirection})
        .toArray()

        const totalCount = await commentCollection.countDocuments(
            {$or: [
                {"login": {$regex: searchLoginTerm, $options: 'i'}}, 
                {"email": {$regex: searchEmailTerm, $options: 'i'}}
            ]}
        )

        const items = users.map(u => {
            return {

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

    async update(comment: CommentType){
        /*await commentCollection.updateOne()
        return {
            //@ts-ignore
            id: user._id,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt,
        }*/
    }

    async delete(id: string){
        const result = await commentCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findCommentbyPostId(id: string, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any){
        const comments = await commentCollection.find({postId: id})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy] : sortDirection})
        .toArray()

        const totalCount = await commentCollection.countDocuments({postId: id})

        const items = comments.map(c => {
            return {
                id: c._id,
                content: c.content,
                userId: c.userId,
                userLogin: c.userLogin,
                createdAt: c.createdAt,
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

    async createCommentbyPostId(comment: CommentType){
        await commentCollection.insertOne(comment)
        return {
            //@ts-ignore
            id: comment._id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
        }
    }
}