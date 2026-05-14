import { Button } from '../styles'
import { Actions, BlogCard, Details, ExternalLink, Summary } from './Blog.styles'

const Blog = ({ blog, user, handleClickLike, handleClickDelete }) => {
  const isOwner = blog.user?.username === user?.username

  return (
    <BlogCard className="blog">
      <Summary className="blog-summary">
        <h2>{blog.author}: {blog.title}</h2>
      </Summary>
      <Details className="blog-details">
        <ExternalLink href={blog.url}>{blog.url}</ExternalLink>
        <Actions>
          <span>{blog.likes} likes</span>
          {user !== null && (
            <Button onClick={() => handleClickLike(blog)}>like</Button>
          )}
          {isOwner && (
            <Button $variant="danger" onClick={() => handleClickDelete(blog)}>delete</Button>
          )}
        </Actions>
        <span>Added by {blog.user?.name}</span>
      </Details>
    </BlogCard>
  )
}

export default Blog
