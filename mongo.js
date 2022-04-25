const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password  = process.argv[2]

const url =
  `mongodb+srv://fso-matt:${password}@cluster0.dnlfu.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // Display All
  console.log("phonebook:")
  Person
    .find({})
    .then(persons => {
      persons.forEach(person => {
        console.log(person)
      })

      mongoose.connection.close()
    })

} else {
  // Add New
  const name    =   process.argv[3]
  const number  =   process.argv[4]

  const person = new Person({
    name: name,
    number: number
  })
  
  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}


