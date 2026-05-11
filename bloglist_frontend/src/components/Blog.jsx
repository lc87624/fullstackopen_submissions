import { useState } from "react"
const Blog = ({ blog, handleClickLike }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const buttonLabel = visible ? 'hide' : 'view'
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
      <div style={showWhenVisible}>
        {blog.url}
        <br />
        {blog.likes} likes
        <button onClick={() => handleClickLike(blog)}>like</button>
        <br />
        {blog.user?.name}
      </div>
    </div>
  )
}

export default Blog
