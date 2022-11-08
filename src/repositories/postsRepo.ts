import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { Post } from "../domain/entities/post";
import { postCollection } from "./db";

@injectable()
export class PostsRepo {
    async find(){
        return postCollection.find({})
    }

    async create(post: Post){
        postCollection.insertOne(post)
    }

    async findById(id: string){
        return postCollection.findOne({_id: new ObjectId(id)})
    }

    async update(id: string, post: Post){
        postCollection.updateOne({_id: new ObjectId(id)}, post)
    }

    async delete(id: string){
        postCollection.deleteOne({_id: new ObjectId(id)})
    }
}