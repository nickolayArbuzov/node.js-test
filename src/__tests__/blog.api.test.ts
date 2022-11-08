import request from 'supertest'
import { app, startServer } from '../index'

jest.setTimeout(60000)
describe('/blogs', () => {

    let inputModelBlog1 = {
        name: 'name',
        youtubeUrl: 'youtubeUrl-1',
    }
    let inputModelBlog2 = {
        name: 'name-2',
        youtubeUrl: 'youtubeUrl-2',
    }
    let updateModelBlog = {
        name: 'name-10',
        youtubeUrl: 'youtubeUrl-10',
    }

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return added blog if values correct', async () => {
        const res = await request(app)
            .post('/blogs')
            .send(inputModelBlog1).expect(201)

        expect(res.body).toStrictEqual([
            {
                id: expect.any(String),
                name: inputModelBlog1.name,
                youtubeUrl: inputModelBlog1.youtubeUrl,
            },
        ])
    })

    
    it('should return errors if values incorrect', async () => {
        await request(app).post('/blogs').send({}).expect(400, 
            {errorMessages: [
                { message: 'incorrect name', field: 'name' },
                { message: 'incorrect youtubeUrl', field: 'youtubeUrl' },
            ]})
    })

    it('should return all blogs', async () => {
        await request(app)
            .post('/blogs')
            .send(inputModelBlog2).expect(201)

        const res = await request(app)
            .get('/blogs')
            .expect(200)

        expect(res.body).toStrictEqual([
                {
                    id: expect.any(String),
                    name: inputModelBlog1.name,
                    youtubeUrl: inputModelBlog1.youtubeUrl,
                }, 
                {
                    id: expect.any(String),
                    name: inputModelBlog1.name,
                    youtubeUrl: inputModelBlog1.youtubeUrl,
                },
            ])
    })

    it('should return one blog', async () => {
        const resGet = await request(app)
            .get('/blogs')

        const res = await request(app)
            .get(`/blogs/${resGet.body[1].id}`)
            .expect(200)

        expect(res.body).toStrictEqual(
            [{
                id: resGet.body[1].id,
                name: inputModelBlog2.name,
                youtubeUrl: inputModelBlog2.youtubeUrl,
            }])
    })

    it('should return 404 if blog for get not found', async () => {
        await request(app)
            .get(`/blogs/${3}`)
            .expect(404)
    })

    it('should return update blog if values correct', async () => {
        const resGet = await request(app)
            .get('/blogs')

        await request(app)
            .put(`/blogs/${resGet.body[0].id}`)
            .send(updateModelBlog).expect(204)

        const res = await request(app)
            .get(`/blogs/${resGet.body[0].id}`)
            .expect(200)
        
        expect(res.body).toStrictEqual(
            [{
                id: expect.any(String),
                name: updateModelBlog.name,
                youtubeUrl: updateModelBlog.youtubeUrl,
            }]
        )
    })

    it('should return errors if values incorrect', async () => {
        const resGet = await request(app)
            .get('/blogs')

        await request(app)
            .put(`/blogs/${resGet.body[0].id}`)
            .send({})
            .expect(400, {errorMessages: [
                { message: 'incorrect name', field: 'name' },
                { message: 'incorrect youtubeUrl', field: 'youtubeUrl' },
            ]})
    })

    it('should return 404 if blog for put not found', async () => {
        await request(app)
            .put(`/blogs/${4}`)
            .send(updateModelBlog)
            .expect(404)
    })

    it('should return status 204 if blog deleted', async () => {
        const resGet = await request(app)
            .get('/blogs')

        await request(app)
            .delete(`/blogs/${resGet.body[0].id}`)
            .expect(204)

        await request(app)
            .get(`/blogs/${2}`)
            .expect(404)

        const res = await request(app)
            .get(`/blogs`)
        
        expect(res.body.length).toBe(1)
    })

    it('should return status 404 if blog for delete not found', async () => {
        await request(app)
            .delete(`/blogs/${4}`)
            .expect(404)

        const res = await request(app)
            .get(`/blogs`)
        
        expect(res.body.length).toBe(1)
    })

})