import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useMatch, Navigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('success')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  const handleLogin = async ({ username, password }) => {
    try {
      console.log('Logging in with', username, password)
      const user = await loginService.login({ username, password })
      console.log('Logged in user:', user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setNotificationMessage(`Logged in as ${user.name}`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      return true
    } catch (error) {
      console.error('Error logging in:', error)
      setNotificationMessage('Invalid username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      return false
    }
  }

  const handleCreateBlog = async (blogObject) => {
    if (user === null) {
      navigate('/login')
      return
    }
    try {
      console.log('Creating blog with', blogObject)
      const newBlog = await blogService.create(blogObject)
      console.log('Created blog:', newBlog)
      setBlogs(blogs.concat(newBlog))
      setNotificationMessage(`A new blog "${newBlog.title}" by ${newBlog.author} added`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      navigate('/')
    } catch (error) {
      console.error('Error creating blog:', error.response?.data || error.message)
      setNotificationMessage('Error creating blog: ' + (error.response?.data?.error || error.message))
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleClickLike = async (blog) => {
    if (user === null) {
      navigate('/login')
      return
    }
    try {
      const updatedBlog = await blogService.update(blog.id, {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1
      })

      setBlogs(blogs.map(item =>
        item.id === blog.id ? updatedBlog : item
      ))
    } catch (error) {
      console.error('Error liking blog:', error.response?.data || error.message)
      setNotificationMessage('Error liking blog: ' + (error.response?.data?.error || error.message))
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const handleClickDelete = async (blog) => {
    if (user === null) {
      navigate('/login')
      return
    }
    if (window.confirm(`Are you sure you want to delete "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(item => item.id !== blog.id))
        setNotificationMessage(`Deleted blog "${blog.title}" by ${blog.author}`)
        setNotificationType('success')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
        navigate('/')
      } catch (error) {
        console.error('Error deleting blog:', error.response?.data || error.message)
        setNotificationMessage('Error deleting blog: ' + (error.response?.data?.error || error.message))
        setNotificationType('error')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      }
    }
  }

  const loginInfo = () => (
    <p>
      Logged in as {user.name}
    </p>
  )

  const logoutButton = () => (
    <button onClick={() => {
      window.localStorage.removeItem('loggedBlogAppUser')
      setUser(null)
      navigate('/')
    }}>
      logout
    </button>
  )

  const blogList = () => {
    console.log('Rendering blog list with blogs:', blogs)
    const blogsToShow = blogs.toSorted((a, b) => b.likes - a.likes)

    return (
      <div>
        <h2>blogs</h2>
        <ul>
          {blogsToShow.map(blog =>
            <li key={blog.id}>
              <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
            </li>
          )}
        </ul>
      </div>
    )
  }

  const blogView = () => {
    const blog = match
      ? blogs.find(blog => blog.id === match.params.id)
      : null
    return (
      blog
        ? <Blog blog={blog} user={user} handleClickLike={handleClickLike} handleClickDelete={handleClickDelete} />
        : <Navigate to="/" replace />
    )
  }

  const createView = () => {
    return (
      user
        ? <BlogForm handleCreateBlog={handleCreateBlog} />
        : <Navigate to="/login" replace />
    )
  }

  return (
    <div>
      <div>
        <Link style={{ marginRight: '10px' }} to="/">blogs</Link>
        {user && <Link style={{ marginRight: '10px' }} to="/create">new blog</Link>}
        {!user && <Link to="/login">login</Link>}
        {user && logoutButton()}
      </div>
      <Notification message={notificationMessage} type={notificationType} />
      {user && loginInfo()}
      <Routes>
        <Route path="/" element={blogList()} />
        <Route path="/login" element={!user && <LoginForm handleLogin={handleLogin} />} />
        <Route path="/blogs/:id" element={blogView()} />
        <Route path="/create" element={createView()} />
      </Routes>
    </div>
  )
}

export default App
