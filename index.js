require('dotenv').config()

const express = require('express')
const morgan = require('morgan')

const app = express()
app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then(count => {
    response.send(`
            <p>Phonebook has info for ${count} people</p>
            <p>${new Date()}</p>
        `)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id).then(result => {
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'Name and number are required' })
  }

  Person.findOne({ name }).then(existingPerson => {
    if (existingPerson) {
      return response.status(400).json({ error: 'Name must be unique' })
    }

    const person = new Person({
      name,
      number,
    })

    return person.save().then(savedPerson => {
      response.status(201).json(savedPerson)
    })
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    id,
    { name, number },
    { returnDocument: 'after', runValidators: true }
  ).then(updatedPerson => {
    if (updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Invalid id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`)
  })
}

module.exports = app

