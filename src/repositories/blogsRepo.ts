import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { blogType } from "../types";
import { blogCollection } from "./db";

@injectable()
export class BlogsRepo {
    async find(){
        const blogs = await blogCollection.find().project({createdAt: 0}).toArray()
        return blogs.map(b => {
            //@ts-ignore
            delete Object.assign(b, {["id"]: b["_id"] })["_id"];
            return b
        })
    }

    async create(blog: blogType){
        await blogCollection.insertOne(blog)
        return {
            //@ts-ignore
            id: blog._id,
            name: blog.name,
            youtubeUrl: blog.youtubeUrl,
        }
    }

    async findById(id: string){
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if(blog) {
            return {
                id: blog._id,
                name: blog.name,
                youtubeUrl: blog.youtubeUrl,
            }
        }
        return false
    }

    async update(id: string, blog: blogType){
        const result = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: blog})
        return result.matchedCount === 1
    }

    async delete(id: string){
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}