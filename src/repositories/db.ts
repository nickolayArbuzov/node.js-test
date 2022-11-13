import {MongoClient} from 'mongodb'
import "dotenv/config";
import { PostType, BlogType, UserInputType, CommentType} from '../types';

const mongoURI = process.env.MONGO_URL || "";

export const client = new MongoClient(mongoURI);
export const blogCollection = client.db("test").collection<BlogType>("blogs");
export const postCollection = client.db("test").collection<PostType>("posts");
export const userCollection = client.db("test").collection<UserInputType>("users");
export const commentCollection = client.db("test").collection<CommentType>("comments");
export const logCollection = client.db("test").collection<PostType>("logs");

export async function runDb(){
    try {
        await client.connect();
        await client.db("back").command({ping:1})
    }
    catch{
        await client.close()
    }
}

