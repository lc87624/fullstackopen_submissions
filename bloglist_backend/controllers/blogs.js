const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog
        .find({})
        .populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }

    const blog = new Blog({
        ...request.body,
        user: user.id
    })

    const result = await blog.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.status(201).json(result)
})

blogRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if (!user) {
        return response.status(401).json({ error: 'token missing or invalid' })
    }
    
    const blogToDelete = await Blog.findById(request.params.id)
    
    if (!blogToDelete) {
        return response.status(404).end()
    }
    if (!blogToDelete.user || blogToDelete.user.toString() !== user.id.toString()) {
        return response.status(403).json({ error: 'only the creator can delete the blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
})

module.exports = blogRouter
