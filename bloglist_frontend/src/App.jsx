import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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

  const handleLogin = async (event) => {
    try {
      event.preventDefault()
      const username = event.target.username.value
      const password = event.target.password.value
      console.log('Logging in with', username, password)
      const user = await loginService.login({ username, password })
      console.log('Logged in user:', user)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(`Logged in as ${user.name}`)
      setNotificationType('success')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error logging in:', error)
      setNotificationMessage('Invalid username or password')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const createBlog = async (blogObject) => {
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
    } catch (error) {
      console.error('Error creating blog:', error.response?.data || error.message)
      setNotificationMessage('Error creating blog: ' + (error.response?.data?.error || error.message))
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }

  }

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username:
            <input
              type="text"
              name="username"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password:
            <input
              type="password"
              name="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const blogForm = () => (
    <BlogForm createBlog={createBlog} />
  )

  const loginInfo = () => (
    <p>
      Logged in as {user.name}
      <button onClick={() => {
        window.localStorage.removeItem('loggedBlogAppUser')
        setUser(null)
      }}>
        logout
      </button>
    </p>
  )

  const blogList = () => {
    console.log('Rendering blog list with blogs:', blogs)
    return (
      <div>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} type={notificationType} />
      <h2>blogs</h2>
      {!user && loginForm()}
      {user && loginInfo()}
      {user && blogForm()}
      {user && blogList()}
    </div>
  )
}

export default App
