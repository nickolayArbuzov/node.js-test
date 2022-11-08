import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { postType } from "../types";
import { postCollection } from "./db";

@injectable()
export class PostsRepo {
    async find(){
        return await postCollection.find({})
    }

    async create(post: postType){
        postCollection.insertOne(post)
    }

    async findById(id: string){
        return await postCollection.findOne({_id: new ObjectId(id)})
    }

    async update(id: string, post: postType){
        await postCollection.updateOne({_id: new ObjectId(id)}, post)
    }

    async delete(id: string){
        await postCollection.deleteOne({_id: new ObjectId(id)})
    }
}