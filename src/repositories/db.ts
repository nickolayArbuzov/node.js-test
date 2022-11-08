import {MongoClient} from 'mongodb'
import "dotenv/config";
import { CreateBlog } from '../domain/entities/blog';
import { Post } from '../domain/entities/post';

const mongoURI = process.env.MONGO_URL || "";

export const client = new MongoClient(mongoURI);
export const blogCollection = client.db("test").collection<CreateBlog>("blogs");
export const postCollection = client.db("test").collection<Post>("posts");

export async function runDb(){
    try {
        await client.connect();
        await client.db("back").command({ping:1})
    }
    catch{
        await client.close()
    }
}

