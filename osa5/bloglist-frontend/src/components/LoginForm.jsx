import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, FormGroup, Input, Button } from './StyledElements'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    const success = await onLogin(username, password)
    if (success) {
      setUsername('')
      setPassword('')
      navigate('/')
    }
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>username</label>
          <Input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </FormGroup>
        <FormGroup>
          <label>password</label>
          <Input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </FormGroup>
        <Button type="submit">login</Button>
      </Form>
    </div>
  )
}

export default LoginForm