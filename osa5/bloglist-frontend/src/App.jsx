import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()
  const match = useMatch('/blogs/:id')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      notify(`${user.name} logged in`)
      return true
    } catch {
      notify('wrong username or password', 'error')
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
    notify('logged out')
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      const blogWithUser =
        returnedBlog.user && typeof returnedBlog.user === 'object'
          ? returnedBlog
          : {
            ...returnedBlog,
            user: { username: user.username, name: user.name, id: returnedBlog.user }
          }

      setBlogs(blogs.concat(blogWithUser))
      notify(`a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`)
      return true
    } catch {
      notify('failed to create blog: missing title or url', 'error')
      return false
    }
  }

  const handleLike = async (blog) => {
    try {
      const updatedBlogData = {
        user: blog.user ? blog.user.id || blog.user._id || blog.user : null,
        likes: blog.likes + 1,
        author: blog.author,
        title: blog.title,
        url: blog.url
      }

      const returnedBlog = await blogService.update(blog.id, updatedBlogData)
      const blogWithUser = {
        ...returnedBlog,
        user: blog.user
      }

      setBlogs(blogs.map(b => (b.id === blog.id ? blogWithUser : b)))
    } catch {
      notify('failed to update likes', 'error')
    }
  }

  const handleDelete = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify(`Removed ${blog.title}`)
        return true
      } catch {
        notify('failed to delete blog', 'error')
        return false
      }
    }
    return false
  }

  const matchedBlog = match
    ? blogs.find(b => b.id === match.params.id)
    : null

  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes)

  const navStyle = {
    backgroundColor: '#e2e8f0',
    padding: '8px 12px',
    marginBottom: 16,
    display: 'flex',
    gap: 12,
    alignItems: 'center'
  }

  const blogItemStyle = {
    paddingTop: 10,
    paddingLeft: 4,
    paddingBottom: 10,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div>
      <nav style={navStyle}>
        <Link to="/">blogs</Link>
        {user ? (
          <>
            <Link to="/create">create new</Link>
            <span>{user.name} logged in</span>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <Link to="/login">login</Link>
        )}
      </nav>

      <h2>blog app</h2>
      <Notification notification={notification} />

      <Routes>
        <Route
          path="/"
          element={
            <div>
              {sortedBlogs.map(blog => (
                <div key={blog.id} style={blogItemStyle} className="blog-list-item">
                  <Link to={`/blogs/${blog.id}`}>
                    {blog.title} {blog.author}
                  </Link>
                </div>
              ))}
            </div>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={matchedBlog}
              currentUser={user}
              handleLike={handleLike}
              handleDelete={handleDelete}
            />
          }
        />
        <Route
          path="/create"
          element={user ? <BlogForm createBlog={addBlog} /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route
          path="/login"
          element={<LoginForm onLogin={handleLogin} />}
        />
      </Routes>
    </div>
  )
}

export default App