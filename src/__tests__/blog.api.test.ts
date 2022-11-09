import request from 'supertest'
import { app } from '../index'
import { runDb } from '../repositories/db'

//регулярка для даты с time-zone
//StringMatching /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/,

const port = 4444
const startServer = async () => {
    await runDb()
    return app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

jest.setTimeout(60000)
describe('/blogs', () => {

    const server = startServer()

    let blogId = '636c166b30cc7431cea999c8'
    const incorrectBlogId = '036b26ccc6049bc21dec991e'

    const queryBlog = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
        searchNameTerm: null,
    }

    const queryPost = {
        pageNumber: 1,
        pageSize: 10,
        sortBy: 'createdAt',
        sortDirection: 'desc',
    }

    let inputModelBlog1 = {
        name: 'name-1',
        youtubeUrl: 'https://someurl1.com',
    }
    let inputModelBlog2 = {
        name: 'name-2',
        youtubeUrl: 'https://someurl2.com',
    }
    let updateModelBlog = {
        name: 'name-10',
        youtubeUrl: 'https://someurl10.com',
    }

    let inputModelPost1 = {
        title: "title-1",
        shortDescription: "shortDescription-1",
        content: "content-1",
    }
    let inputModelPost2 = {
        title: "title-2",
        shortDescription: "shortDescription-2",
        content: "content-2",
    }
    let inputModelPost3 = {
        title: "title-3",
        shortDescription: "shortDescription-3",
        content: "content-3",
    }
    let inputModelPost4 = {
        title: "title-4",
        shortDescription: "shortDescription-4",
        content: "content-4",
    }
    let updateModelPost = {
        title: "title-10",
        shortDescription: "shortDescription-10",
        content: "content-10",
    }

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return added blog if values correct', async () => {
        const res = await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelBlog1).expect(201)

        expect(res.body).toStrictEqual(
            {
                createdAt: expect.any(String),
                id: expect.any(String),
                name: inputModelBlog1.name,
                youtubeUrl: inputModelBlog1.youtubeUrl,
            },
        )
        blogId = res.body.id
    })

    it('should return errors if values of blogs incorrect', async () => {
        await request(app).post('/blogs').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({}).expect(400, 
            {errorsMessages: [
                { message: 'Invalid URL', field: 'youtubeUrl' },
                { message: 'field must be from 1 to 15 chars', field: 'name' },
            ]})
    })

    it('should return added post if values correct', async () => {
        const res = await request(app)
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...inputModelPost1, blogId: blogId}).expect(201)

        expect(res.body).toStrictEqual(
            {
                createdAt: expect.any(String),
                id: expect.any(String),
                title: inputModelPost1.title,
                shortDescription: inputModelPost1.shortDescription,
                content: inputModelPost1.content,
                blogId: blogId,
                blogName: expect.any(String),
            },
        )
    })

    it('should return all blogs with default sort', async () => {
        await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelBlog2).expect(201)

        const res = await request(app)
            .get('/blogs')
            .expect(200)

        expect(res.body).toStrictEqual(
            {
                pagesCount: Math.ceil(2/10),
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        name: inputModelBlog2.name,
                        youtubeUrl: inputModelBlog2.youtubeUrl,
                    }, 
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        name: inputModelBlog1.name,
                        youtubeUrl: inputModelBlog1.youtubeUrl,
                    },
                ]
            })
    })

    it('should return all posts with default sort', async () => {
        await request(app) 
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...inputModelPost2, blogId: blogId}).expect(201)

        const res = await request(app)
            .get('/posts')
            .expect(200)

        expect(res.body).toStrictEqual(
            {
                pagesCount: Math.ceil(2/10),
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items:[
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost2.title,
                        shortDescription: inputModelPost2.shortDescription,
                        content: inputModelPost2.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    }, 
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost1.title,
                        shortDescription: inputModelPost1.shortDescription,
                        content: inputModelPost1.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    },
                ]
            }
        )
    })

    it('should create post with default sort by blogId', async () => {
        const test = await request(app) 
            .post(`/blogs/${blogId}/posts`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...inputModelPost3}).expect(201)
        const res = await request(app)
            .get('/posts')
            .expect(200)

        expect(res.body).toStrictEqual(
            {
                pagesCount: Math.ceil(3/10),
                page: 1,
                pageSize: 10,
                totalCount: 3,
                items:[
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost3.title,
                        shortDescription: inputModelPost3.shortDescription,
                        content: inputModelPost3.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    },
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost2.title,
                        shortDescription: inputModelPost2.shortDescription,
                        content: inputModelPost2.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    }, 
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost1.title,
                        shortDescription: inputModelPost1.shortDescription,
                        content: inputModelPost1.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    },
                ]
            }
        )
    })

    it('should return all posts by blogId', async () => {
        const test = await request(app) 
            .post(`/blogs/${blogId}/posts`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...inputModelPost4, blogId: blogId}).expect(201)
        const res = await request(app)
            .get('/posts')
            .expect(200)

        expect(res.body).toStrictEqual(
            {
                pagesCount: Math.ceil(4/10),
                page: 1,
                pageSize: 10,
                totalCount: 4,
                items:[
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost4.title,
                        shortDescription: inputModelPost4.shortDescription,
                        content: inputModelPost4.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    },
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost3.title,
                        shortDescription: inputModelPost3.shortDescription,
                        content: inputModelPost3.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    },
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost2.title,
                        shortDescription: inputModelPost2.shortDescription,
                        content: inputModelPost2.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    }, 
                    {
                        createdAt: expect.any(String),
                        id: expect.any(String),
                        title: inputModelPost1.title,
                        shortDescription: inputModelPost1.shortDescription,
                        content: inputModelPost1.content,
                        blogId: blogId,
                        blogName: expect.any(String),
                    },
                ]
            }
        )
    })

    it('should return one blog', async () => {
        const resGet = await request(app)
            .get('/blogs')

        const res = await request(app)
            .get(`/blogs/${resGet.body.items[1].id}`)
            .expect(200)

        expect(res.body).toStrictEqual(
            {
                createdAt: expect.any(String),
                id: resGet.body.items[1].id,
                name: inputModelBlog1.name,
                youtubeUrl: inputModelBlog1.youtubeUrl,
            })
    })

    it('should return one post', async () => {
        const resGet = await request(app)
            .get('/posts')

        const res = await request(app)
            .get(`/posts/${resGet.body.items[1].id}`)
            .expect(200)

        expect(res.body).toStrictEqual(
            {
                createdAt: expect.any(String),
                id: expect.any(String),
                title: inputModelPost3.title,
                shortDescription: inputModelPost3.shortDescription,
                content: inputModelPost3.content,
                blogId: blogId,
                blogName: expect.any(String),
            })
    })

    it('should return 404 if blog for get not found', async () => {
        await request(app)
            .get(`/blogs/${incorrectBlogId}`)
            .expect(404)
    })

    it('should return 404 if post for get not found', async () => {
        await request(app)
            .get(`/posts/${incorrectBlogId}`)
            .expect(404)
    })

    it('should return update blog if values correct', async () => {
        const resGet = await request(app)
            .get('/blogs')

        await request(app)
            .put(`/blogs/${resGet.body.items[0].id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(updateModelBlog).expect(204)

        const res = await request(app)
            .get(`/blogs/${resGet.body.items[0].id}`)
            .expect(200)
        
        expect(res.body).toStrictEqual(
            {
                createdAt: expect.any(String),
                id: expect.any(String),
                name: updateModelBlog.name,
                youtubeUrl: updateModelBlog.youtubeUrl,
            }
        )
    })

    it('should return update post if values correct', async () => {
        const resGet = await request(app)
            .get('/posts')

        await request(app)
            .put(`/posts/${resGet.body.items[0].id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...updateModelPost, blogId: blogId, blogName: blogId}).expect(204)

        const res = await request(app)
            .get(`/posts/${resGet.body.items[0].id}`)
            .expect(200)
        
        expect(res.body).toStrictEqual(
            {
                createdAt: expect.any(String),
                id: resGet.body.items[0].id,
                title: updateModelPost.title,
                shortDescription: updateModelPost.shortDescription,
                content: updateModelPost.content,
                blogId: blogId,
                blogName: expect.any(String),
            }
        )
    })

    it('should return errors if values for update blog incorrect', async () => {
        const resGet = await request(app)
            .get('/blogs')

        await request(app)
            .put(`/blogs/${resGet.body.items[0].id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({})
            .expect(400, {errorsMessages: [
                { message: 'field must be from 1 to 15 chars', field: 'name' },
                { message: 'Invalid URL', field: 'youtubeUrl' },
            ]})
    })

    it('should return errors if values for update post incorrect', async () => {
        const resGet = await request(app)
            .get('/posts')

        await request(app)
            .put(`/posts/${resGet.body.items[0].id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({})
            .expect(400, {errorsMessages: [
                { message: 'field must be from 1 to 100 chars', field: 'shortDescription' },
                { message: 'field must be from 1 to 30 chars', field: 'title' },
                { message: 'field must be from 1 to 1000 chars', field: 'content' },
                { message: 'field must be string', field: 'blogId' },
            ]})
    })

    it('should return 404 if blog for put not found', async () => {
        await request(app)
            .put(`/blogs/${incorrectBlogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(updateModelBlog)
            .expect(404)
    })

    it('should return 404 if blog for put not found', async () => {
        await request(app)
            .put(`/posts/${incorrectBlogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...updateModelPost, blogId: blogId, blogName: blogId})
            .expect(404)
    })

    it('should return status 204 if blog deleted', async () => {
        const resGet = await request(app)
            .get('/blogs')

        await request(app)
            .delete(`/blogs/${resGet.body.items[0].id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        await request(app)
            .get(`/blogs/${resGet.body.items[0].id}`)
            .expect(404)

        const res = await request(app)
            .get(`/blogs`)
        
        expect(res.body.items.length).toBe(1)
    })

    it('should return status 204 if post deleted', async () => {
        const resGet = await request(app)
            .get('/posts')

        await request(app)
            .delete(`/posts/${resGet.body.items[0].id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        await request(app)
            .get(`/posts/${resGet.body.items[0].id}`)
            .expect(404)

        const res = await request(app)
            .get(`/posts`)
        
        expect(res.body.items.length).toBe(3)
    })

    it('should return status 404 if blog for delete not found', async () => {
        await request(app)
            .delete(`/blogs/${incorrectBlogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

        const res = await request(app)
            .get(`/blogs`)
        
        expect(res.body.items.length).toBe(1)
    })

    it('should return status 404 if post for delete not found', async () => {
        await request(app)
            .delete(`/posts/${incorrectBlogId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

        const res = await request(app)
            .get(`/posts`)
        
        expect(res.body.items.length).toBe(3)
    })

    server.then((server) => server.close())

})