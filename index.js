require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

// Before Middleware
app.use(express.json())
// app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('build'))

morgan.token('data', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :req[content-length] - :response-time ms :data'))



// Helper Methods
const generateRandId = () => {
  return Math.floor(Math.random() * 1000)
}



// GET
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// app.get('/info', (request, response) => {
//   response.send(`Phonebook has info for ${persons.length} people</br></br>${new Date()}`)
// })




// POST
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name && !body.number) {
    let error_str = "name and number is missing"
    return response.status(400).json({
      error: error_str
    })
  }  
  
  if (!body.name || !body.number) {
    let error_str = 
      `${body.name ? '' : 'name'}${body.number ? '' : 'number'} is missing`
    return response.status(400).json({
      error: error_str
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})





// DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})






// After Middleware





const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})