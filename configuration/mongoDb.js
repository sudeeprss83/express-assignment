require('dotenv').config()
const mongoose = require('mongoose')

const connectionString = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@feedback.jb91z.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`

const connection = mongoose.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log('Database connection established...')
  }
)

module.exports = connection
