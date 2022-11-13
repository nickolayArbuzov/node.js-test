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
        login: 'login-1',
        password: "password-1",
        email: "www.mail-1@mail.com",
    }
    let inputModelUser2 = {
        login: 'login-2',
        password: "password-2",
        email: "www.mail-2@mail.com",
    }
    let inputModelUser3 = {
        login: 'login-3',
        password: "password-3",
        email: "www.mail-3@mail.com",
    }
    let inputModelUser4 = {
        login: 'login-4',
        password: "password-4",
        email: "www.mail-4@mail.com",
    }
    let correctInputModelAuth = {
        login: 'login-4',
        password: "password-4",
    }
    let incorrectPassInputModelAuth = {
        login: 'login-4',
        password: "password-5",
    }
    let incorrectInputModelAuth = {
        login: 'login-5',
        password: "password-5",
    }

    let accessToken = ''
    let incorrectToken = ''

    let postId = ''
    let incorrectPostId = ''

    let realUserId = ''
    let incorrectUserId = '000d727e3f7e0f76da66c064'

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return added user if values correct', async () => {
        await request(app)
            .post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelUser1).expect(201)
        await request(app)
            .post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelUser2).expect(201)
        await request(app)
            .post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelUser3).expect(201)
        await request(app)
            .post('/users')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelUser4).expect(201)

        const res = await request(app).get(`/users`).set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        realUserId = res.body.items[0].id

        expect(res.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 4,
            items: [
                {
                    id: expect.any(String),
                    login: inputModelUser4.login,
                    email: inputModelUser4.email,
                    createdAt: expect.any(String)
                },
                {
                    id: expect.any(String),
                    login: inputModelUser3.login,
                    email: inputModelUser3.email,
                    createdAt: expect.any(String)
                },
                {
                    id: expect.any(String),
                    login: inputModelUser2.login,
                    email: inputModelUser2.email,
                    createdAt: expect.any(String)
                },
                {
                    id: expect.any(String),
                    login: inputModelUser1.login,
                    email: inputModelUser1.email,
                    createdAt: expect.any(String)
                },
            ]
        })
    })

    it('should return 401 if auth-header missing', async () => {
        await request(app).get(`/users`).expect(401)
    })

    it('should return accesstoken with login by correct values', async () => {
        const auth = await request(app).post('/auth/login').send(correctInputModelAuth).expect(200)
        accessToken = auth.body.accessToken
        expect(auth.body).toStrictEqual({
            accessToken: expect.any(String)
        })
    })

    it('should add comment with correct accesToken', async () => {
        const auth = await request(app).post('/gfdg/comments').send(correctInputModelAuth).expect(200)
        accessToken = auth.body.accessToken
        expect(auth.body).toStrictEqual({
            accessToken: expect.any(String)
        })
    })

    it('should return 403 if try to add comment with not valid token', async () => {
        const auth = await request(app).post('/gfdg/comments').send(correctInputModelAuth).expect(403)
        accessToken = auth.body.accessToken
        expect(auth.body).toStrictEqual({
            accessToken: expect.any(String)
        })
    })

    it('should return accesstoken with login by correct values', async () => {
        const auth = await request(app).post('/auth/login').send(correctInputModelAuth).expect(200)
        accessToken = auth.body.accessToken
        expect(auth.body).toStrictEqual({
            accessToken: expect.any(String)
        })
    })

    it('should return 401 if pass not correct', async () => {
        const auth = await request(app).post('/auth/login').send(incorrectPassInputModelAuth).expect(401)
        expect(auth.body).toStrictEqual({})
    })

    it('should return 401 if login not found', async () => {
        const auth = await request(app).post('/auth/login').send(incorrectInputModelAuth).expect(401)
        expect(auth.body).toStrictEqual({})
    })
    
    it('should return errors if values incorrect', async () => {
        await request(app).post('/users').set('Authorization', 'Basic YWRtaW46cXdlcnR5').send({}).expect(400, 
            {errorsMessages: [
                { message: 'field must be from 1 to 30 chars', field: 'login' },
                { message: 'field must be from 1 to 30 chars', field: 'password' },
                { message: 'field must be email-format', field: 'email' },
            ]})
    })

    it('should return status 204 if user deleted', async () => {
        await request(app)
            .delete(`/users/${realUserId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(204)

        const res = await request(app)
            .get(`/users`).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        
        expect(res.body.items.length).toBe(3)
    })

    it('should return status 404 if user for delete not found', async () => {
        await request(app)
            .delete(`/users/${incorrectUserId}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .expect(404)

        const res = await request(app)
            .get(`/users`).set('Authorization', 'Basic YWRtaW46cXdlcnR5')
        
        expect(res.body.items.length).toBe(3)
    })

    server.then((server) => server.close())

})