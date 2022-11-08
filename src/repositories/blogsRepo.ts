import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { blogType } from "../types";
import { blogCollection } from "./db";

@injectable()
export class BlogsRepo {
    async find(){
        return await blogCollection.find({})
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
        return await blogCollection.findOne({_id: new ObjectId(id)})
    }

    async update(id: string, blog: blogType){
        return await blogCollection.updateOne({_id: new ObjectId(id)}, blog)
    }

    async delete(id: string){
        return await blogCollection.deleteOne({_id: new ObjectId(id)})
    }
}