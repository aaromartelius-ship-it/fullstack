import { useNavigate } from 'react-router-dom'

const Blog = ({ blog, currentUser, handleLike, handleDelete }) => {
  const navigate = useNavigate()

  if (!blog) {
    return null
  }

  const isCreator =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username || blog.user === currentUser.id)

  const onRemove = async () => {
    const deleted = await handleDelete(blog)
    if (deleted) {
      navigate('/')
    }
  }

  return (
    <div className="blog">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        likes {blog.likes}{' '}
        {currentUser && (
          <button onClick={() => handleLike(blog)}>like</button>
        )}
      </div>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
      {isCreator && (
        <button onClick={onRemove} style={{ marginTop: 8 }}>
          remove
        </button>
      )}
    </div>
  )
}

export default Blog