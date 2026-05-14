const Blog = ({ blog, user, handleClickLike, handleClickDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const isOwner = blog.user?.username === user?.username

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-summary">
        <h2>{blog.author}: {blog.title}</h2>
      </div>
      <div className="blog-details">
        <a href={blog.url}>{blog.url}</a>
        <br/>
        {blog.likes} likes
        {user !== null && (
          <button onClick={() => handleClickLike(blog)}>like</button>
        )}
        <br/>
        Added by {blog.user?.name}
        <br/>
        {isOwner && (
          <button onClick={() => handleClickDelete(blog)}>delete</button>
        )}
      </div>
    </div >
  )
}

export default Blog
