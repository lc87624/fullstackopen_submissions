import { useState } from 'react'
import { Button, Field, Form, Input, Panel, Subtitle, Title } from '../styles'

const BlogForm = ({ handleCreateBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const onsubmit = async (event) => {
    event.preventDefault()
    await handleCreateBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <Panel>
      <Title>Create New</Title>
      <Subtitle>Add a useful link to the shared reading list.</Subtitle>
      <Form onSubmit={onsubmit}>
        <Field>
          title:
          <Input
            type="text"
            name="title"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </Field>
        <Field>
          author:
          <Input
            type="text"
            name="author"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </Field>
        <Field>
          url:
          <Input
            type="text"
            name="url"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
          />
        </Field>
        <Button type="submit">create</Button>
      </Form>
    </Panel>
  )
}

export default BlogForm
