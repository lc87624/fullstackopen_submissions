import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
  test('calls createBlog with the right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const handleCreateBlog = vi.fn()

    render(<BlogForm handleCreateBlog={handleCreateBlog} />)

    await user.type(screen.getByLabelText('title:'), 'Testing React forms')
    await user.type(screen.getByLabelText('author:'), 'Ada Lovelace')
    await user.type(screen.getByLabelText('url:'), 'https://example.com/testing-react-forms')
    await user.click(screen.getByText('create'))

    expect(handleCreateBlog).toHaveBeenCalledTimes(1)
    expect(handleCreateBlog).toHaveBeenCalledWith({
      title: 'Testing React forms',
      author: 'Ada Lovelace',
      url: 'https://example.com/testing-react-forms'
    })
  })
})
