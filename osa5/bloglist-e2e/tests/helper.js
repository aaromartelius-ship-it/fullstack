const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.locator('input[name="Username"]').fill(username)
  await page.locator('input[name="Password"]').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'create new' }).click()
  await page.locator('input[name="Title"]').fill(title)
  await page.locator('input[name="Author"]').fill(author)
  await page.locator('input[name="Url"]').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByRole('link', { name: `${title} ${author}` }).waitFor()
}

module.exports = { loginWith, createBlog }