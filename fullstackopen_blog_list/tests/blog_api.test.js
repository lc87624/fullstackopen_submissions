const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)
let authToken

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    }
]

describe('blogs api', () => {
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

        const blogObjects = initialBlogs.map(blog => new Blog({
            ...blog,
            user: user.id
        }))
        const promiseArray = blogObjects.map(blog => blog.save())
        const savedBlogs = await Promise.all(promiseArray)

        user.blogs = savedBlogs.map(blog => blog._id)
        await user.save()
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('a unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs')

        assert.ok(response.body[0].id)
        assert.strictEqual(response.body[0]._id, undefined)
    })

    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, initialBlogs.length + 1)

        const titles = response.body.map(blog => blog.title)
        assert.ok(titles.includes('Canonical string reduction'))
    })

    test('likes defaults to 0 if it is missing from the request', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)
    })

    test('adding a blog fails with status 401 if token is missing', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    test('adding a blog fails with status 401 if token is invalid', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', 'Bearer invalid-token')
            .send(newBlog)
            .expect(401)
    })

    test('a blog without title is not added', async () => {
        const newBlog = {
            author: 'Robert C. Martin',
            url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(400)
    })

    test('a blog without url is not added', async () => {
        const newBlog = {
            title: 'First class tests',
            author: 'Robert C. Martin',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(400)
    })

    test('a blog can be deleted', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(204)

        const blogsAtEnd = await api.get('/api/blogs')

        assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)

        const ids = blogsAtEnd.body.map(blog => blog.id)
        assert.ok(!ids.includes(blogToDelete.id))
    })

    test('deleting a blog fails with status 401 if token is missing', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const blogToDelete = blogsAtStart.body[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)

        const blogsAtEnd = await api.get('/api/blogs')

        assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length)
    })

    test('deleting a blog with a nonexistent id returns 404', async () => {
        const blogsAtStart = await api.get('/api/blogs')
        const nonexistentId = new mongoose.Types.ObjectId().toString()

        await api
            .delete(`/api/blogs/${nonexistentId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(404)

        const blogsAtEnd = await api.get('/api/blogs')

        assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length)
    })

    test('deleting a blog with an invalid id returns 400', async () => {
        const blogsAtStart = await api.get('/api/blogs')

        await api
            .delete('/api/blogs/invalid-id')
            .set('Authorization', `Bearer ${authToken}`)
            .expect(400)

        const blogsAtEnd = await api.get('/api/blogs')

        assert.strictEqual(blogsAtEnd.body.length, blogsAtStart.body.length)
    })

    test('blogs include the creator user information', async () => {
        const user = await User.findOne({ username: 'root' })

        const newBlog = {
            title: 'User populated blog',
            author: 'Test Author',
            url: 'https://example.com/user-populated-blog',
            likes: 3
        }

        const createdBlog = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${authToken}`)
            .send(newBlog)
            .expect(201)

        const response = await api.get('/api/blogs')
        const populatedBlog = response.body.find(blog => blog.id === createdBlog.body.id)

        assert.strictEqual(populatedBlog.user.username, user.username)
        assert.strictEqual(populatedBlog.user.name, user.name)
        assert.strictEqual(populatedBlog.user.id, user.id)
        assert.strictEqual(populatedBlog.user.passwordHash, undefined)
    })
})

after(async () => {
    await mongoose.connection.close()
})
