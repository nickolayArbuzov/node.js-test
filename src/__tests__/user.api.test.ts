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

    let inputModelBlog1 = {
        name: 'name-1',
        youtubeUrl: 'https://someurl1.com',
    }

    let inputModelPost1 = {
        title: "title-1",
        shortDescription: "shortDescription-1",
        content: "content-1",
    }

    let accessToken = ''
    let incorrectToken = '0000bGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzczODA3MmZhMjM0MmJmZTg1MzFhMjQiLCJpYXQiOjE2Njg1MTM5MDYsImV4cCI6MTY2ODYwMDMwNn0.0b5aWY3mwo9vOsglyEmMTr40xWOtSP0uSiU72gP-tdw'
    let accessToken2 = ''

    let blogId = ''

    let postId = ''
    let incorrectPostId = ''

    let commentId = ''
    let incorrectCommentId = '0003b872d6a1bb7b389b9087'

    let realUserId = ''
    let incorrectUserId = '000d727e3f7e0f76da66c064'

    it('should delete all data', async () => {
        await request(app).delete('/testing/all-data').expect(204)
    })

    it('should return added blog if values correct', async () => {
        const res = await request(app)
            .post('/blogs')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(inputModelBlog1).expect(201)

        blogId = res.body.id
    })

    it('should create and return one post', async () => {
        const res = await request(app) 
            .post('/posts')
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send({...inputModelPost1, blogId: blogId}).expect(201)

        postId = res.body.id
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

        realUserId = res.body.items[3].id

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

        const auth2 = await request(app).post('/auth/login').send(correctInputModelAuth2)
        accessToken2 = auth2.body.accessToken
    })

    it('should return info about user by correct accesstoken', async () => {
        const auth = await request(app).get('/auth/me').set('Authorization', `Bearer ${accessToken}`)
    
        expect(auth.body).toStrictEqual({
            email: inputModelUser1.email,
            login: inputModelUser1.login,
            userId: realUserId,
        })
    })

    it('should return 401 if request for info about user by incorrect accesstoken', async () => {
        await request(app).get('/auth/me').set('Authorization', `Bearer ${incorrectToken}`).expect(401)
    })

    it('should add comment with correct accesToken', async () => {
        const comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .send({content: 'content-content-content'})
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(201)

        commentId = comment.body.id

        expect(comment.body).toStrictEqual({
            content: "content-content-content",
            createdAt: expect.any(String),
            id: expect.any(String),
            userId: realUserId,
            userLogin: correctInputModelAuth.login,
        })
    })

    it('should return comment by id', async () => {
        const res = await request(app)
            .get(`/comments/${commentId}`)
            .expect(200)

        expect(res.body).toStrictEqual({
            content: "content-content-content",
            createdAt: expect.any(String),
            id: commentId,
            userId: realUserId,
            userLogin: correctInputModelAuth.login,
        })
    })

    it('should return 404 if comment by id not found', async () => {
        await request(app)
            .get(`/comments/${incorrectCommentId}`)
            .expect(404)
    })

    it('should return 401 if try to add comment with not valid token', async () => {
        await request(app)
            .post(`/posts/${postId}/comments`)
            .send({content: 'content-content-content'})
            .expect(401)
    })

    it('should return comments by postId', async () => {
        const res = await request(app)
            .get(`/posts/${postId}/comments`)
            .send({content: 'content-content-content'})
            .expect(200) 
        
        expect(res.body).toStrictEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [
                {
                    content: 'content-content-content',
                    id: expect.any(String),
                    userId: realUserId,
                    userLogin: inputModelUser1.login,
                    createdAt: expect.any(String)
                },
            ]
        })
    })

    it('should return 204 if user update own comment', async () => {
        await request(app)
            .put(`/comments/${commentId}`)
            .send({content: 'content-content-content-content'})
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(204)
    })

    it('should return 403 if user update alien comment', async () => {
        await request(app)
            .put(`/comments/${commentId}`)
            .send({content: 'content-content-content-content'})
            .set('Authorization', `Bearer ${accessToken2}`)
            .expect(403)
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

})