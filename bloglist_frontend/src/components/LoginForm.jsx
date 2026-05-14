import { useState } from 'react'
import { Button, Field, Form, Input, Panel, Subtitle, Title } from '../styles'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = async (event) => {
    event.preventDefault()

    const loginSucceeded = await handleLogin({ username, password })
    if (loginSucceeded) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <Panel>
      <Title>Log In</Title>
      <Subtitle>Sign in to add, like, and manage blogs.</Subtitle>
      <Form onSubmit={onSubmit}>
        <Field>
          username:
          <Input
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </Field>
        <Field>
          password:
          <Input
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </Field>
        <Button type="submit">login</Button>
      </Form>
    </Panel>
  )
}

export default LoginForm
