import { useNavigate } from 'react-router-dom'
import { BlogCard, LikesRow, Button } from './StyledElements'

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
    <BlogCard className="blog">
      <h2>
        {blog.title} — {blog.author}
      </h2>
      <div>
        <a href={blog.url} target="_blank" rel="noreferrer">
          {blog.url}
        </a>
      </div>
      <LikesRow>
        <span>likes {blog.likes}</span>
        {currentUser && (
          <Button onClick={() => handleLike(blog)}>like</Button>
        )}
      </LikesRow>
      <div>added by {blog.user ? blog.user.name : 'unknown'}</div>
      {isCreator && (
        <Button $danger onClick={onRemove}>
          remove
        </Button>
      )}
    </BlogCard>
  )
}

export default Blog