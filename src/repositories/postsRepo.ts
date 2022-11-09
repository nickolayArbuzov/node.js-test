import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { PostType } from "../types";
import { postCollection } from "./db";

@injectable()
export class PostsRepo {
    async find(pageNumber: number, pageSize: number, sortBy: string, sortDirection: any){
        const posts = await postCollection.find({})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy] : sortDirection})
        .toArray()

        const totalCount = await postCollection.count({});

        const items = posts.map(p => {
            //@ts-ignore
            delete Object.assign(p, {["id"]: p["_id"] })["_id"];
            return p
        })

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