import request from 'supertest'
import { app } from '../app'

jest.setTimeout(60000)
describe('/users', () => {

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
    let correctInputModelAuth = {
        login: 'login-1',
        password: "password-1",
    }
    let correctInputModelAuth2 = {
        login: 'login-3',
        password: "password-3",
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
    let incorrectAccessToken = '0000bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzczODA3MmZhMjM0MmJmZTg1MzFhMjQiLCJpYXQiOjE2Njg1MTM5MDYsImV4cCI6MTY2ODYwMDMwNn0.0b5aWY3mwo9vOsglyEmMTr40xWOtSP0uSiU72gP-tdw'
    let accessToken2 = ''

    let refreshToken = ''
    let incorrectRefreshToken = ''

    let realUserId = ''
    let incorrectUserId = '000d727e3f7e0f76da66c064'

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return registration user if values correct', async () => {
        await request(app)
            .post('/auth/registration')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelUser1).expect(204)
        await request(app)
            .post('/auth/registration')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelUser2).expect(204)

        const res = await request(app).get(`/users`).set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        realUserId = res.body.items[1].id
    })

    it('should return accesstoken with login by correct values', async () => {
        const auth = await request(app).post('/auth/login').send(correctInputModelAuth).expect(200)
        accessToken = auth.body.accessToken
        expect(auth.body).toStrictEqual({
            accessToken: expect.any(String)
        })

        const auth2 = await request(app).post('/auth/login').send(correctInputModelAuth2)
        accessToken2 = auth2.body.accessToken
    })
    
    it('should return errors if values incorrect', async () => {
        await request(app).post('/auth/registration').send({}).expect(400, 
            {errorsMessages: [
                { message: 'field must be from 1 to 30 chars', field: 'login' },
                { message: 'field must be from 1 to 30 chars', field: 'password' },
                { message: 'field must be email-format', field: 'email' },
            ]})
    })

})