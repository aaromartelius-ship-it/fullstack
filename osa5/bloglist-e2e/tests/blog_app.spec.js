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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.locator('nav').getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'vaarasalasana')
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.locator('nav').getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.locator('nav').getByText('Matti Luukkainen logged in')).toBeVisible()
    })
    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Playwright E2E testing', 'Test Author', 'https://playwright.dev')
      await expect(page.getByRole('link', { name: 'Playwright E2E testing Test Author' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Likeable Blog', 'Author One', 'https://example.com/like')

      await page.getByRole('link', { name: 'Likeable Blog Author One' }).click()

      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the creator can delete a blog', async ({ page }) => {
      await createBlog(page, 'Blog to Delete', 'Creator User', 'https://example.com/delete')

      await page.getByRole('link', { name: 'Blog to Delete Creator User' }).click()

      page.once('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('link', { name: 'Blog to Delete Creator User' })).not.toBeVisible()
    })
  })
})