import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
  test('5.16: calls createBlog with right details when a new blog is created', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<BlogForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]
    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'Testing a form with Vitest')
    await user.type(authorInput, 'Jane Doe')
    await user.type(urlInput, 'https://example.com/vitest-form')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0]).toEqual({
      title: 'Testing a form with Vitest',
      author: 'Jane Doe',
      url: 'https://example.com/vitest-form'
    })
  })
})