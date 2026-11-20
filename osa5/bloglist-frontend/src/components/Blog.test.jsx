import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Blog from './Blog'

describe('<Blog />', () => {
  const sampleBlog = {
    id: '12345',
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'https://example.com/testing',
    likes: 5,
    user: {
      username: 'creatoruser',
      name: 'Creator User'
    }
  }

  test('renders blog details and likes for unauthenticated user, without any buttons', () => {
    render(
      <MemoryRouter>
        <Blog blog={sampleBlog} currentUser={null} />
      </MemoryRouter>
    )

    expect(screen.getByText('Component testing is done with react-testing-library Test Author')).toBeDefined()
    expect(screen.getByText('https://example.com/testing')).toBeDefined()
    expect(screen.getByText(/likes 5/)).toBeDefined()
    expect(screen.getByText(/added by Creator User/)).toBeDefined()

    expect(screen.queryByRole('button', { name: 'like' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('renders only like button for logged in user who is not the creator', () => {
    const otherUser = {
      username: 'otheruser',
      name: 'Other User'
    }

    render(
      <MemoryRouter>
        <Blog blog={sampleBlog} currentUser={otherUser} />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.queryByRole('button', { name: 'remove' })).toBeNull()
  })

  test('renders both like and remove buttons for the blog creator', () => {
    const creatorUser = {
      username: 'creatoruser',
      name: 'Creator User'
    }

    render(
      <MemoryRouter>
        <Blog blog={sampleBlog} currentUser={creatorUser} />
      </MemoryRouter>
    )

    expect(screen.getByRole('button', { name: 'like' })).toBeDefined()
    expect(screen.getByRole('button', { name: 'remove' })).toBeDefined()
  })
})