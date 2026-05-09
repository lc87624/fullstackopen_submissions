const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))
    return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const blogsByAuthor = _.countBy(blogs, 'author')
    const authorWithMostBlogs = _.maxBy(Object.entries(blogsByAuthor), ([, blogs]) => blogs)

    return {
        author: authorWithMostBlogs[0],
        blogs: authorWithMostBlogs[1]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const likesByAuthor = _.mapValues(_.groupBy(blogs, 'author'), blogs => _.sumBy(blogs, 'likes'))
    const authorWithMostLikes = _.maxBy(Object.entries(likesByAuthor), ([, likes]) => likes)

    return {
        author: authorWithMostLikes[0],
        likes: authorWithMostLikes[1]
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
