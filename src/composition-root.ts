import 'reflect-metadata'
import {Container} from 'inversify'
import { BlogsController } from './controllers/blogsController'
import { BlogsService } from './domain/blogsService'
import { BlogsRepo } from './repositories/blogsRepo'
import { PostsController } from './controllers/postsController'
import { PostsService } from './domain/postsService'
import { PostsRepo } from './repositories/postsRepo'
import { UsersController } from './controllers/usersController'
import { UsersService } from './domain/usersService'
import { UsersRepo } from './repositories/usersRepo'
import { AuthController } from './controllers/authController'
import { AuthService } from './domain/authService'

export const container = new Container()

container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepo).to(BlogsRepo)

container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(PostsRepo).to(PostsRepo)

container.bind(UsersController).to(UsersController)
container.bind(UsersService).to(UsersService)
container.bind(UsersRepo).to(UsersRepo)

container.bind(AuthController).to(AuthController)
container.bind(AuthService).to(AuthService)