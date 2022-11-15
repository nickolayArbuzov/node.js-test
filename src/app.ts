import express, {Request, Response} from 'express'

import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogsRouter";
import {postsRouter} from "./routes/postsRouter";
import { usersRouter } from './routes/usersRouter';
import { authRouter } from './routes/authRouter';
import { commentsRouter } from './routes/commentsRouter';
import { blogCollection, commentCollection, postCollection, userCollection } from './repositories/db';

const port = process.env.PORT || 7777
export const app = express()

app.use(bodyParser.json())
app.use('/blogs', blogsRouter) 
app.use('/posts', postsRouter) 
app.use('/users', usersRouter) 
app.use('/auth', authRouter) 
app.use('/comments', commentsRouter) 

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await postCollection.deleteMany({})
    await blogCollection.deleteMany({})
    await userCollection.deleteMany({})
    await commentCollection.deleteMany({})
    res.sendStatus(204)
}) 

app.get('/', (req: Request, res: Response) => {
    res.send({message: 'Inversify+'})
})