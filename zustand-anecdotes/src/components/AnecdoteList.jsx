import { useAnecdoteActions } from '../store'

const AnecdoteList = ({ anecdotes }) => {
  const { voteFor } = useAnecdoteActions()

  const sortedAnecdotes = anecdotes.slice().sort((a, b) => b.votes - a.votes)
  return (
    <div>
      {sortedAnecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => voteFor(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList