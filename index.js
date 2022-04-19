const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

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

// POST /api/persons 200 61 - 4.896ms {"name": "Liisa Marttinen", "number": "351-351531"}

// DATA
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

// Helper Methods
const generateRandId = () => {
  return Math.floor(Math.random() * 1000)
}

const getNames = () => persons.map(person => person.name)

const isDuplicate = (name) => {
  for (i = 0; i < persons.length; i++) {
    if (persons[i].name.toLowerCase() === name.toLowerCase()) {
      return true
    }
  }
  
  return false
}

// GET
app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people</br></br>${new Date()}`)
})




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

  if (isDuplicate(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }


  const person = {
    id: generateRandId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)

  response.json(persons)
})





// DELETE
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})






// After Middleware





const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})