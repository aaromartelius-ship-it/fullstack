const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const heading = page.getByText('Log in to application')
    await expect(heading).toBeVisible()
    await expect(page.locator('input[name="Username"]')).toBeVisible()
    await expect(page.locator('input[name="Password"]')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in', { exact: true })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'vaarasalasana')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in', { exact: true })).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in', { exact: true })).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright E2E testing', 'Test Author', 'https://playwright.dev')
      await expect(page.getByText('Playwright E2E testing Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable Blog', 'Author One', 'https://example.com/like')

      const blogElement = page.locator('.blog').filter({ hasText: 'Likeable Blog Author One' })
      await blogElement.getByRole('button', { name: 'view' }).click()

      await expect(blogElement.getByText('likes 0')).toBeVisible()
      await blogElement.getByRole('button', { name: 'like' }).click()
      await expect(blogElement.getByText('likes 1')).toBeVisible()
    })

    test('the creator can delete a blog', async ({ page }) => {
      await createBlog(page, 'Blog to Delete', 'Creator User', 'https://example.com/delete')

      const blogElement = page.locator('.blog').filter({ hasText: 'Blog to Delete Creator User' })
      await blogElement.getByRole('button', { name: 'view' }).click()

      page.once('dialog', dialog => dialog.accept())
      await blogElement.getByRole('button', { name: 'remove' }).click()

      await expect(page.locator('.blog').filter({ hasText: 'Blog to Delete Creator User' })).not.toBeVisible()
    })

    test('only the creator sees the delete button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Toinen Kayttaja',
          username: 'toinen',
          password: 'salainen'
        }
      })

      await createBlog(page, 'Mattis Private Blog', 'Matti Luukkainen', 'https://example.com/matti')

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'toinen', 'salainen')
      await expect(page.getByText('Toinen Kayttaja logged in', { exact: true })).toBeVisible()

      const blogElement = page.locator('.blog').filter({ hasText: 'Mattis Private Blog Matti Luukkainen' })
      await blogElement.getByRole('button', { name: 'view' }).click()

      await expect(blogElement.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered according to likes with most likes first', async ({ page }) => {
      await createBlog(page, 'First Blog', 'Author A', 'https://example.com/1')
      await createBlog(page, 'Second Blog', 'Author B', 'https://example.com/2')
      await createBlog(page, 'Third Blog', 'Author C', 'https://example.com/3')

      const firstBlog = page.locator('.blog').filter({ hasText: 'First Blog Author A' })
      const secondBlog = page.locator('.blog').filter({ hasText: 'Second Blog Author B' })
      const thirdBlog = page.locator('.blog').filter({ hasText: 'Third Blog Author C' })

      await firstBlog.getByRole('button', { name: 'view' }).click()
      await secondBlog.getByRole('button', { name: 'view' }).click()
      await thirdBlog.getByRole('button', { name: 'view' }).click()

      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog.getByText('likes 1')).toBeVisible()
      await thirdBlog.getByRole('button', { name: 'like' }).click()
      await expect(thirdBlog.getByText('likes 2')).toBeVisible()

      await secondBlog.getByRole('button', { name: 'like' }).click()
      await expect(secondBlog.getByText('likes 1')).toBeVisible()

      const blogElements = page.locator('.blog')
      await expect(blogElements.nth(0)).toContainText('Third Blog Author C')
      await expect(blogElements.nth(1)).toContainText('Second Blog Author B')
      await expect(blogElements.nth(2)).toContainText('First Blog Author A')
    })
  })
})