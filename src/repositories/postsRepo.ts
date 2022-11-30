import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { PostType } from "../types";
import { postCollection } from "./db";
import { LikesRepo } from "./likesRepo";

@injectable()
export class PostsRepo {
    constructor(
        @inject(LikesRepo) protected likesRepo: LikesRepo
    ) {}
    
    async find(pageNumber: number, pageSize: number, sortBy: string, sortDirection: any, userId: string){
        const posts = await postCollection.find({})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy] : sortDirection})
        .toArray()

        const totalCount = await postCollection.countDocuments({});

        const items: any = []
        for await (const p of posts) {
            const extendedLikesInfo = await this.likesRepo.getLikesInfoForPost(p._id.toString(), userId)
            items.push({
                id: p._id,
                title: p.title,
                shortDescription: p.shortDescription,
                content: p.content,
                blogId: p.blogId,
                blogName: p.blogName,
                createdAt: p.createdAt,
                extendedLikesInfo: extendedLikesInfo,
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

    async create(post: PostType){
        await postCollection.insertOne(post)
        return {
            //@ts-ignore
            id: post._id,
            createdAt: post.createdAt,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: "None",
                newestLikes: [],
            }
        }
    }

    async findById(id: string){
        const post = await postCollection.findOne({_id: new ObjectId(id)})

        if(post) {
            return {
                id: post._id,
                createdAt: post.createdAt,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogId,
            }
        }
        return false
    }

    async update(id: string, post: PostType){
        const result = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: post})
        return result.matchedCount === 1
    }

    async delete(id: string){
        const result = await postCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}