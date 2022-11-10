import express, {Request, Response} from 'express'
import * as dotenv from 'dotenv'
import bodyParser from "body-parser";
import {blogsRouter} from "./routes/blogsRouter";
import {postsRouter} from "./routes/postsRouter";
import { usersRouter } from './routes/usersRouter';
import { authRouter } from './routes/authRouter';

import { blogCollection, postCollection, runDb, userCollection } from './repositories/db';

dotenv.config()

const port = process.env.PORT || 7777
export const app = express()

app.use(bodyParser.json())
app.use('/blogs', blogsRouter) 
app.use('/posts', postsRouter) 
app.use('/users', usersRouter) 
app.use('/auth', authRouter) 

app.delete('/testing/all-data', async (req: Request, res: Response) => {
    await postCollection.deleteMany({})
    await blogCollection.deleteMany({})
    await userCollection.deleteMany({})
    res.sendStatus(204)
}) 

app.get('/', (req: Request, res: Response) => {
    res.send({message: 'Inversify+'})
})

const startServer = async () => {
    await runDb()
    return app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

startServer()