import request from 'supertest'
import { app } from '../index'
import { runDb } from '../repositories/db'

const port = 4444
const startServer = async () => {
    await runDb()
    return app.listen(port, () => {
        console.log(`App listening on port ${port}`)
    })
}

jest.setTimeout(60000)
describe('/users', () => {

    const server = startServer()

    let inputModelUser1 = {
        id: '1',
        login: 'login-1',
        password: "password-1",
        email: "mail-1"
    }
    let inputModelUser2 = {
        id: '2',
        login: 'login-2',
        password: "password-2",
        email: "mail-2"
    }
    let inputModelUser3 = {
        id: '3',
        login: 'login-3',
        password: "password-3",
        email: "mail-3"
    }
    let inputModelUser4 = {
        id: '4',
        login: 'login-4',
        password: "password-4",
        email: "mail-4"
    }

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return added user if values correct', async () => {
        await request(app)
            .post('/users')
            .send(inputModelUser1).expect(201)
        await request(app)
            .post('/users')
            .send(inputModelUser2).expect(201)
        await request(app)
            .post('/users')
            .send(inputModelUser3).expect(201)
        await request(app)
            .post('/users')
            .send(inputModelUser4).expect(201)

        const res = await request(app).get(`/users?pagesCount=1&page=1&pageSize=5`)

        expect(res.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: inputModelUser1.id,
                    login: inputModelUser1.login,
                    email: inputModelUser1.email,
                    createdAt: expect.any(String)
                },
                {
                    id: inputModelUser2.id,
                    login: inputModelUser2.login,
                    email: inputModelUser2.email,
                    createdAt: expect.any(String)
                },
                {
                    id: inputModelUser3.id,
                    login: inputModelUser3.login,
                    email: inputModelUser3.email,
                    createdAt: expect.any(String)
                },
                {
                    id: inputModelUser4.id,
                    login: inputModelUser4.login,
                    email: inputModelUser4.email,
                    createdAt: expect.any(String)
                },
            ]
        })
    })
    
    it('should return errors if values incorrect', async () => {
        await request(app).post('/users').send({}).expect(400, 
            {errorMessages: [
                { message: 'incorrect title', field: 'title' },
                { message: 'incorrect author', field: 'author' },
            ]})
    })

    it('should return status 204 if user deleted', async () => {
        await request(app)
            .delete(`/users/${2}`)
            .expect(204)

        const res = await request(app)
            .get(`/users`)
        
        expect(res.body.length).toBe(1)
    })

    it('should return status 404 if user for delete not found', async () => {
        await request(app)
            .delete(`/users/${4}`)
            .expect(404)

        const res = await request(app)
            .get(`/users`)
        
        expect(res.body.length).toBe(1)
    })

    server.then((server) => server.close())

})