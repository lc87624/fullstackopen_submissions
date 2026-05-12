import { useState } from 'react'
const Blog = ({ blog, user, handleClickLike, handleClickDelete }) => {
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
  const isOwner = blog.user?.username === user?.username

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-summary">
        {blog.title} {blog.author}
      </div>
      <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
      <div className="blog-details" style={showWhenVisible}>
        {blog.url}
        <br/>
        {blog.likes} likes
        <button onClick={() => handleClickLike(blog)}>like</button>
        <br/>
        {blog.user?.name}
        <br/>
        {isOwner && (
          <button onClick={() => handleClickDelete(blog)}>delete</button>
        )}
      </div>
    </div>
  )
}

export default Blog
