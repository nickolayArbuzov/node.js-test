import express, {Request, Response} from 'express'
import cookieParser from 'cookie-parser'
import {blogsRouter} from "./routes/blogsRouter";
import {postsRouter} from "./routes/postsRouter";
import { usersRouter } from './routes/usersRouter';
import { authRouter } from './routes/authRouter';
import { commentsRouter } from './routes/commentsRouter';
import { blogCollection, commentCollection, jwtCollection, logCollection, postCollection, userCollection } from './repositories/db';

const port = process.env.PORT || 7777
export const app = express()

app.use(express.json())
app.use(cookieParser())
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
    await jwtCollection.deleteMany({})
    await logCollection.deleteMany({})
    res.sendStatus(204)
}) 

app.get('/', (req: Request, res: Response) => {
    res.send({message: 'Inversify+'})
})