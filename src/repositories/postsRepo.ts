import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { postType } from "../types";
import { postCollection } from "./db";

@injectable()
export class PostsRepo {
    async find(){
        const posts = await postCollection.find().project({createdAt: 0}).toArray()
        return posts.map(p => {
            //@ts-ignore
            delete Object.assign(p, {["id"]: p["_id"] })["_id"];
            return p
        })
    }

    async create(post: postType){
        await postCollection.insertOne(post)
        return {
            //@ts-ignore
            id: post._id,
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
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogId,
            }
        }
        return false
    }

    async update(id: string, post: postType){
        const result = await postCollection.updateOne({_id: new ObjectId(id)}, {$set: post})
        return result.matchedCount === 1
    }

    async delete(id: string){
        const result = await postCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}