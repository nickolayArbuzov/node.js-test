import request from 'supertest'
import { app } from '../index'

/*jest.setTimeout(60000)
describe('/video', () => {

    let inputModelVideo1 = {
        id: '1',
        title: 'title',
        author: 'author',
        availableResolutions: ['P144'],
    }
    let inputModelVideo2 = {
        id: '2',
        title: 'title2',
        author: 'author2',
        availableResolutions: ['P240'],
    }
    let updateModelVideo = {
        title: 'new title',
        author: 'new author',
        minAgeRestriction: 18,
    }

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return added video if values correct', async () => {
        await request(app)
            .post('/videos')
            .send(inputModelVideo1).expect(201)
        await request(app)
            .post('/videos')
            .send(inputModelVideo2).expect(201)

        const res = await request(app).get(`/videos/${inputModelVideo1.id}`)

        expect(res.body).toStrictEqual([
            {
                id: inputModelVideo1.id,
                title: inputModelVideo1.title,
                author: inputModelVideo1.author,
                canBeDownloaded: true,
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: inputModelVideo1.availableResolutions
            },
        ])
    })

    
    it('should return errors if values incorrect', async () => {
        await request(app).post('/videos').send({}).expect(400, 
            {errorMessages: [
                { message: 'incorrect title', field: 'title' },
                { message: 'incorrect author', field: 'author' },
            ]})
    })

    it('should return all videos', async () => {
        const res = await request(app)
            .get('/videos')
            .expect(200)

        expect(res.body).toStrictEqual([
                {
                    id: inputModelVideo1.id,
                    title: inputModelVideo1.title,
                    author: inputModelVideo1.author,
                    canBeDownloaded: true,
                    minAgeRestriction: null,
                    createdAt: expect.any(String),
                    publicationDate: expect.any(String),
                    availableResolutions: inputModelVideo1.availableResolutions
                }, 
                {
                    id: inputModelVideo2.id,
                    title: inputModelVideo2.title,
                    author: inputModelVideo2.author,
                    canBeDownloaded: true,
                    minAgeRestriction: null,
                    createdAt: expect.any(String),
                    publicationDate: expect.any(String),
                    availableResolutions: inputModelVideo2.availableResolutions
                },
            ])
    })

    it('should return one video', async () => {
        const res = await request(app)
            .get(`/videos/${inputModelVideo2.id}`)
            .expect(200)

        expect(res.body).toStrictEqual(
            [{
                id: inputModelVideo2.id,
                title: inputModelVideo2.title,
                author: inputModelVideo2.author,
                canBeDownloaded: true,
                minAgeRestriction: null,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: inputModelVideo2.availableResolutions
            }])
    })

    it('should return 404 if video for get not found', async () => {
        await request(app)
            .get(`/videos/${3}`)
            .expect(404)
    })

    it('should return update video if values correct', async () => {
        await request(app)
            .put(`/videos/${1}`)
            .send(updateModelVideo).expect(204)

        const res = await request(app)
            .get(`/videos/${1}`)
            .expect(200)
        
        expect(res.body).toStrictEqual(
            [{
                id: inputModelVideo1.id,
                title: updateModelVideo.title,
                author: updateModelVideo.author,
                canBeDownloaded: true,
                minAgeRestriction: updateModelVideo.minAgeRestriction,
                createdAt: expect.any(String),
                publicationDate: expect.any(String),
                availableResolutions: inputModelVideo1.availableResolutions
            }]
        )
    })

    it('should return errors if values incorrect', async () => {
        await request(app)
            .put(`/videos/${1}`)
            .send({minAgeRestriction: '17', canBeDownloaded: 'true'})
            .expect(400, {errorMessages: [
                { message: 'incorrect title', field: 'title' },
                { message: 'incorrect author', field: 'author' },
                { message: 'incorrect minAgeRestriction', field: 'minAgeRestriction' },
                { message: 'incorrect canBeDownloaded', field: 'canBeDownloaded' },
            ]})
    })

    it('should return 404 if video for put not found', async () => {
        await request(app)
            .put(`/videos/${4}`)
            .send(updateModelVideo)
            .expect(404)
    })

    it('should return status 204 if video deleted', async () => {
        await request(app)
            .delete(`/videos/${2}`)
            .expect(204)

        await request(app)
            .get(`/videos/${2}`)
            .expect(404)

        const res = await request(app)
            .get(`/videos`)
        
        expect(res.body.length).toBe(1)
    })

    it('should return status 404 if video for delete not found', async () => {
        await request(app)
            .delete(`/videos/${4}`)
            .expect(404)

        const res = await request(app)
            .get(`/videos`)
        
        expect(res.body.length).toBe(1)
    })

})*/