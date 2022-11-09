import { injectable, inject } from "inversify";
import { ObjectId } from "mongodb";
import { BlogType, PostType } from "../types";
import { blogCollection, postCollection } from "./db";

@injectable()
export class BlogsRepo {
    async find(searchNameTerm: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any){
        const blogs = await blogCollection.find({"name": {$regex: searchNameTerm, $options : 'i'}})
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .sort({[sortBy] : sortDirection})
        .toArray()

        const totalCount = await blogCollection.count({"name": {$regex: searchNameTerm, $options : 'i'}});

        const items = blogs.map(b => {
            //@ts-ignore
            delete Object.assign(b, {["id"]: b["_id"] })["_id"];
            return b
        })

        return {    
            pagesCount: Math.ceil(totalCount/pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCount,
            items: items,
        }
    }

    async create(blog: BlogType){
        await blogCollection.insertOne(blog)
        return {
            //@ts-ignore
            id: blog._id,
            createdAt: blog.createdAt,
            name: blog.name,
            youtubeUrl: blog.youtubeUrl,
        }
    }

    async createPostByBlogId(id: string, post: PostType){
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if(blog){
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
        } else {
            return false
        }
    }

    async findPostByBlogId(id: string, pageNumber: number, pageSize: number, sortBy: string, sortDirection: any){
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if(blog){
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
        } else {
            return false
        }
    }

    async findById(id: string){
        const blog = await blogCollection.findOne({_id: new ObjectId(id)})
        if(blog) {
            return {
                id: blog._id,
                createdAt: blog.createdAt,
                name: blog.name,
                youtubeUrl: blog.youtubeUrl,
            }
        }
        return false
    }

    async update(id: string, blog: BlogType){
        const result = await blogCollection.updateOne({_id: new ObjectId(id)}, {$set: blog})
        return result.matchedCount === 1
    }

    async delete(id: string){
        const result = await blogCollection.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }
}