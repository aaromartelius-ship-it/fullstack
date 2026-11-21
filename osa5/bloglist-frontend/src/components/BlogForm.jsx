import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, FormGroup, Input, Button } from './StyledElements'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await createBlog({
      title,
      author,
      url
    })
    if (success) {
      setTitle('')
      setAuthor('')
      setUrl('')
      navigate('/')
    }
  }

  return (
    <div>
      <h2>create new</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>title</label>
          <Input
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label>author</label>
          <Input
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label>url</label>
          <Input
            type="text"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </FormGroup>
        <Button type="submit">create</Button>
      </Form>
    </div>
  )
}

export default BlogForm