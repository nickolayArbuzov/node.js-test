import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { CommentType } from "../types";
import { commentCollection } from "./db";
import { LikesRepo } from "./likesRepo";

@injectable()
export class CommentsRepo {
    constructor(
        @inject(LikesRepo) protected likesRepo: LikesRepo
    ) {}

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

    async findOne(id: string){
        const comment = await commentCollection.findOne({_id: new ObjectId(id)})
        if(comment) {
            return {
                id: comment._id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt,
            }
        }
        return false
    }

    async findOneByUserId(id: string){
        const comment = await commentCollection.findOne({userId: id})
        if(comment) {
            return {
                id: comment._id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt,
            }
        }
        return false
    }

    async update(commentId: string, comment: CommentType){
        const result = await commentCollection.updateOne({_id: new ObjectId(commentId)}, {$set: comment})
        return result.matchedCount === 1
    }

    async delete(id: string){
        const result = await commentCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findCommentbyPostId(id: string, pageNumber: number, pageSize: number, sortBy: any, sortDirection: any, userId: string){
        const comments = await commentCollection.find({postId: id})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy] : sortDirection})
        .toArray()

        const totalCount = await commentCollection.countDocuments({postId: id})

        const items: any = []
        for await (const c of comments) {
            const likesInfo = await this.likesRepo.getLikesInfoForComment(c._id.toString(), userId)
            items.push({
                id: c._id,
                content: c.content,
                userId: c.userId,
                userLogin: c.userLogin,
                createdAt: c.createdAt,
                likesInfo: likesInfo,
            })
        }
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
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
            },
        }
    }
}