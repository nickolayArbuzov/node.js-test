import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { CreateBlog, UpdateBlog } from "../domain/entities/blog";
import { blogCollection } from "./db";

@injectable()
export class BlogsRepo {
    async find(){
        return blogCollection.find({})
    }

    async create(blog: CreateBlog){
        blogCollection.insertOne(blog)
    }

    async findById(id: string){
        return blogCollection.findOne({_id: new ObjectId(id)})
    }

    async update(id: string, blog: UpdateBlog){
        blogCollection.updateOne({_id: new ObjectId(id)}, blog)
    }

    async delete(id: string){
        blogCollection.deleteOne({_id: new ObjectId(id)})
    }
}