const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')

const api = supertest(app)
let authToken

describe('users api', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({
            username: 'root',
            name: 'Superuser',
            passwordHash
        })

        await user.save()

        const loginResponse = await api
            .post('/api/login')
            .send({
                username: 'root',
                password: 'secret'
            })

        authToken = loginResponse.body.token
    })

    test('a valid user can be created', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})

        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    })

    test('creation fails with status 400 if username is missing', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})

        assert.match(result.body.error, /username/)
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with status 400 if username is shorter than 3 characters', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})

        assert.match(result.body.error, /username/)
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with status 400 if password is missing', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})

        assert.match(result.body.error, /password/)
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with status 400 if password is shorter than 3 characters', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'sa'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})

        assert.match(result.body.error, /password/)
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with status 400 if username is not unique', async () => {
        const usersAtStart = await User.find({})

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await User.find({})

        assert.match(result.body.error, /unique/)
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('users include the blogs they have created', async () => {
        const user = await User.findOne({ username: 'root' })

        const newBlog = {
            title: 'Root user blog',
            author: 'Superuser',
            url: 'https://example.com/root-user-blog',
            likes: 1,
            userId: user.id
        }

        const createdBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(201)

        const response = await api.get('/api/users')
        const rootUser = response.body.find(user => user.username === 'root')

        assert.strictEqual(rootUser.blogs.length, 1)
        assert.strictEqual(rootUser.blogs[0].title, createdBlog.body.title)
        assert.strictEqual(rootUser.blogs[0].url, createdBlog.body.url)
        assert.strictEqual(rootUser.blogs[0].id, createdBlog.body.id)
    })
})

after(async () => {
    await mongoose.connection.close()
})
