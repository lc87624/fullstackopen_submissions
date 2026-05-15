import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
  const {addAnecdote} = useAnecdoteActions()

  const handleCreate = (event) => {
    event.preventDefault()
    const content = event.target.content.value
    addAnecdote(content)
    event.target.content.value = ''
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <input name='content' />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm