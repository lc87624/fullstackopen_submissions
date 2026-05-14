const { test, expect, describe, beforeEach } = require('@playwright/test')

const backendUrl = 'http://127.0.0.1:3003'

const loginWith = async (page, username, password) => {
  await page.goto('/login')
  await page.getByRole('textbox', { name: 'username:' }).fill(username)
  await page.getByRole('textbox', { name: 'password:' }).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByRole('textbox', { name: 'title:' }).fill(title)
  await page.getByRole('textbox', { name: 'author:' }).fill(author)
  await page.getByRole('textbox', { name: 'url:' }).fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await expect(page.getByRole('link', { name: new RegExp(title) })).toBeVisible()
}

const likeBlog = async (page, title) => {
  await page.goto('/')
  await page.getByRole('link', { name: new RegExp(title) }).click()

  const blog = page.locator('.blog')
  await expect(blog).toBeVisible()

  const likeButton = blog.getByRole('button', { name: 'like' })
  const currentLikes = Number((await blog.textContent()).match(/(\d+) likes/)[1])
  await likeButton.click()
  await expect(blog).toContainText(`${currentLikes + 1} likes`)
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`${backendUrl}/api/testing/reset`)
    await request.post(`${backendUrl}/api/users`, {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await page.goto('/login')

    await expect(page.getByRole('heading', { name: 'log in to application' })).toBeVisible()
    await expect(page.getByText('username:')).toBeVisible()
    await expect(page.getByText('password:')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Logged in as Matti Luukkainen').first()).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorMessage = page.getByText('Invalid username or password')
      await expect(errorMessage).toBeVisible()
      await expect(errorMessage).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('Logged in as Matti Luukkainen')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByRole('link', { name: 'new blog' })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testing React apps', 'Matti Luukkainen', 'https://fullstackopen.com')

      await expect(page.getByRole('link', { name: /Testing React apps/ })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable blog', 'Test Author', 'https://example.com/likeable')

      await likeBlog(page, 'Likeable blog')

      await expect(page.locator('.blog')).toContainText('1 likes')
    })

    test('the user who created a blog can delete it', async ({ page }) => {
      await createBlog(page, 'Disposable blog', 'Test Author', 'https://example.com/disposable')

      await page.getByRole('link', { name: /Disposable blog/ }).click()
      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).click()

      await page.goto('/')
      await expect(page.getByRole('link', { name: /Disposable blog/ })).toHaveCount(0)
    })

    test('only the user who created a blog can see its delete button', async ({ page, request }) => {
      await createBlog(page, 'Private controls', 'Test Author', 'https://example.com/private-controls')

      await page.getByRole('link', { name: /Private controls/ }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toBeVisible()

      await request.post(`${backendUrl}/api/users`, {
        data: {
          name: 'Another User',
          username: 'another',
          password: 'salainen'
        }
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'another', 'salainen')
      await page.goto('/')

      await page.getByRole('link', { name: /Private controls/ }).click()
      await expect(page.getByRole('button', { name: 'delete' })).toHaveCount(0)
    })

    test('blogs are ordered by likes with the most liked blog first', async ({ page }) => {
      await createBlog(page, 'Least liked blog', 'Test Author', 'https://example.com/least')
      await createBlog(page, 'Middle liked blog', 'Test Author', 'https://example.com/middle')
      await createBlog(page, 'Most liked blog', 'Test Author', 'https://example.com/most')

      await likeBlog(page, 'Middle liked blog')
      await likeBlog(page, 'Most liked blog')
      await likeBlog(page, 'Most liked blog')

      await page.goto('/')
      const blogs = page.locator('li')
      await expect(blogs.nth(0)).toContainText('Most liked blog')
      await expect(blogs.nth(1)).toContainText('Middle liked blog')
      await expect(blogs.nth(2)).toContainText('Least liked blog')
    })
  })
})
