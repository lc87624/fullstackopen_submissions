
import { useAnecdotes } from './store'
import AnecdoteList from './components/AnecdoteList'
import AnecdoteForm from './components/AnecdoteForm'
import Filter from './components/Filter'

const App = () => {
  const anecdotes = useAnecdotes()

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList anecdotes={anecdotes} />
      <AnecdoteForm />
    </div>
  )
}

export default App