import {MongoClient} from 'mongodb'
import "dotenv/config";
import { PostType, BlogType} from '../types';

const mongoURI = process.env.MONGO_URL || "";

export const client = new MongoClient(mongoURI);
export const blogCollection = client.db("test").collection<BlogType>("blogs");
export const postCollection = client.db("test").collection<PostType>("posts");

export async function runDb(){
    try {
        await client.connect();
        await client.db("back").command({ping:1})
    }
    catch{
        await client.close()
    }
}

