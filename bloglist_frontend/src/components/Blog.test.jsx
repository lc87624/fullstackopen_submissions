import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import Blog from './Blog'

describe('Blog', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Matti Luukkainen',
    url: 'https://fullstackopen.com/en/part5/testing_react_apps',
    likes: 7,
    user: {
      username: 'mluukkai',
      name: 'Matti Luukkainen'
    }
  }

  test('renders title and author, but not url or likes by default', () => {
    const { container } = render(
      <Blog
        blog={blog}
        user={{ username: 'testuser' }}
        handleClickLike={vi.fn()}
        handleClickDelete={vi.fn()}
      />
    )

    const summary = container.querySelector('.blog-summary')
    const details = container.querySelector('.blog-details')

    expect(summary).toHaveTextContent(blog.title)
    expect(summary).toHaveTextContent(blog.author)
    expect(details).toHaveTextContent(blog.url)
    expect(details).toHaveTextContent(`${blog.likes} likes`)
    expect(details).not.toBeVisible()
  })

  test('shows url and likes when the view button is clicked', async () => {
    const user = userEvent.setup()

    const { container } = render(
      <Blog
        blog={blog}
        user={{ username: 'testuser' }}
        handleClickLike={vi.fn()}
        handleClickDelete={vi.fn()}
      />
    )

    const details = container.querySelector('.blog-details')
    const button = screen.getByText('view')

    await user.click(button)

    expect(details).toBeVisible()
    expect(details).toHaveTextContent(blog.url)
    expect(details).toHaveTextContent(`${blog.likes} likes`)
  })

  test('calls the like handler twice when the like button is clicked twice', async () => {
    const user = userEvent.setup()
    const handleClickLike = vi.fn()

    render(
      <Blog
        blog={blog}
        user={{ username: 'testuser' }}
        handleClickLike={handleClickLike}
        handleClickDelete={vi.fn()}
      />
    )

    await user.click(screen.getByText('view'))
    await user.click(screen.getByText('like'))
    await user.click(screen.getByText('like'))

    expect(handleClickLike).toHaveBeenCalledTimes(2)
  })
})
