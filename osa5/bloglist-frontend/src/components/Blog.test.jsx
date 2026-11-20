import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const sampleBlog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://example.com/testing',
    likes: 5,
    user: {
      username: 'testuser',
      name: 'Test User'
    }
  }

  test('5.13: renders title and author by default, but not url or likes', () => {
    render(<Blog blog={sampleBlog} />)

    const titleAndAuthor = screen.getByText('Component testing is done with react-testing-library Test Author')
    expect(titleAndAuthor).toBeDefined()

    const urlElement = screen.queryByText('https://example.com/testing')
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText('likes 5')
    expect(likesElement).toBeNull()
  })

  test('5.14: renders url, likes and user name when view button is clicked', async () => {
    render(<Blog blog={sampleBlog} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    expect(screen.getByText('https://example.com/testing')).toBeDefined()
    expect(screen.getByText(/likes 5/)).toBeDefined()
    expect(screen.getByText('Test User')).toBeDefined()
  })

  test('5.15: calls event handler twice when like button is clicked twice', async () => {
    const mockLikeHandler = vi.fn()

    render(<Blog blog={sampleBlog} handleLike={mockLikeHandler} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockLikeHandler.mock.calls).toHaveLength(2)
  })
})