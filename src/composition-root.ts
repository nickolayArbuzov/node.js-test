import 'reflect-metadata'
import {Container} from 'inversify'
import { BlogsController } from './controllers/blogsController'
import { BlogsService } from './domain/blogsService'
import { BlogsRepo } from './repositories/blogsRepo'
import { PostsController } from './controllers/postsController'
import { PostsService } from './domain/postsService'
import { PostsRepo } from './repositories/postsRepo'

export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepo).to(BlogsRepo)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepo).to(PostsRepo)