import express, {Request, Response} from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors';
import { blogCollection, commentCollection, devicesCollection, likesCollection, logCollection, postCollection, userCollection } from './repositories/db';
import {blogsRouter} from "./routes/blogsRouter";
import {postsRouter} from "./routes/postsRouter";
import { usersRouter } from './routes/usersRouter';
import { authRouter } from './routes/authRouter';
import { commentsRouter } from './routes/commentsRouter';
import { devicesRouter } from './routes/devicesRouter';

const port = process.env.PORT || 7777
export const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.set('trust proxy', true)

app.use('/blogs', blogsRouter) 
app.use('/posts', postsRouter) 
app.use('/users', usersRouter) 
app.use('/auth', authRouter) 
app.use('/comments', commentsRouter) 
app.use('/security/devices', devicesRouter) 

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    const p = postCollection.deleteMany({})
    const b = blogCollection.deleteMany({})
    const u = userCollection.deleteMany({})
    const c = commentCollection.deleteMany({})
    const d = devicesCollection.deleteMany({})
    const like = likesCollection.deleteMany({})
    const l = logCollection.deleteMany({})
    await Promise.all([p, b, u, c, d, like, l])
    res.sendStatus(204)
}) 

app.get('/', async (req: Request, res: Response) => {
    res.send({message: 'hello world'})
})