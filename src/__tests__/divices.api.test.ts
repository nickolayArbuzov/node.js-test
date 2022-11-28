import request from 'supertest'
import { app } from '../app'

jest.setTimeout(10000)
describe('/users', () => {

    let inputModelUser1 = {
        login: 'login-1',
        password: "password-1",
        email: "nickarbuzov@yandex.by",
    }
    let inputModelUser2 = {
        login: 'login-2',
        password: "password-2",
        email: "www.mail-2@mail.com",
    }
    let correctInputModelAuth = {
        loginOrEmail: 'nickarbuzov@yandex.by',
        password: "password-1",
    }
    let correctInputModelAuth2 = {
        loginOrEmail: 'login-2',
        password: "password-2",
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

    let deletedDeviceId = ''

    let cookie: any = []

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return devices by userId', async () => {

        await request(app)
            .post('/auth/registration')
            .send(inputModelUser1)

        const auth = await request(app).post('/auth/login')
            .set('user-agent', 'Mozilla')
            .send(correctInputModelAuth)
        await request(app).post('/auth/login')
            .set('user-agent', 'AppleWebKit')
            .send(correctInputModelAuth)
        await request(app).post('/auth/login')
            .set('user-agent', 'Chrome')
            .send(correctInputModelAuth)
        await request(app).post('/auth/login')
            .set('user-agent', 'Safari')
            .send(correctInputModelAuth)

        refreshToken = auth.header['set-cookie'][0].split(';')[0].split('=')[1]
        
        cookie = auth.header['set-cookie']
        const devices = await request(app)
            .get('/security/devices').set('Cookie', cookie)

        deletedDeviceId = devices.body[3].deviceId

        expect(devices.body.length).toBe(4)

        expect(devices.body[0]).toStrictEqual({
                ip: expect.any(String),
                title: expect.any(String),
                lastActiveDate: expect.any(String),
                deviceId: expect.any(String)
        })
    })

    it('should delete device by deviceId', async () => {
        await request(app)
            .delete(`/security/devices/${deletedDeviceId}`).set('Cookie', cookie)

        const devices = await request(app)
            .get('/security/devices').set('Cookie', cookie)

        expect(devices.body.length).toBe(3)
    })

    it('should delete incorrect device by deviceId', async () => {
        await request(app)
            .delete(`/security/devices/${deletedDeviceId}`).set('Cookie', cookie).expect(404)

        const devices = await request(app)
            .get('/security/devices').set('Cookie', cookie)

        expect(devices.body.length).toBe(3)
    })

    it('should delete devices exept current device current user', async () => {
        await request(app)
            .delete('/security/devices').set('Cookie', cookie)

        const devices = await request(app)
            .get('/security/devices').set('Cookie', cookie)

        expect(devices.body.length).toBe(1)
    })

    it('should delete current device, if user logout', async () => {
        await request(app)
            .post('/auth/logout').set('Cookie', cookie)

        const devices = await request(app)
            .get('/security/devices').set('Cookie', cookie)

        expect(devices.body.length).toBe(0)
    })

})