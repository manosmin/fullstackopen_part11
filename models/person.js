require('dotenv').config()

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 2, required: true },
  number: { type: String, minLength: 8, required: true },
})

module.exports = mongoose.model('Person', personSchema)
