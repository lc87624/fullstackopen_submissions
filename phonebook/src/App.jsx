import { useState } from 'react'
import './App.css'

const Person = ({ person }) => <p>{person.name} {person.number}</p>

function App() {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Arto Hellas', number: '040-123456' },
    { id: 2, name: 'Ada Lovelace', number: '39-44-5323523' },
    { id: 3, name: 'Dan Abramov', number: '12-43-234345' },
    { id: 4, name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handlePersonSubmit = (event) => {
    event.preventDefault()
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
    setNewNumber('')
  }

  const [filter, setFilter] = useState('')

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const showPersons = 
    filter === '' 
    ? persons 
    : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with <input value={filter} onChange={handleFilterChange} />
      </div>
      <form onSubmit={handlePersonSubmit}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {showPersons.map(person => <Person key={person.id} person={person} />)}
    </div>
  )
}

export default App
