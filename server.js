// require('dotenv').config()
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// REMOVE X-POWERED-BY FROM RESPONSE HEADER
app.disable('x-powered-by')
// REMOVE SERVER FROM RESPONSE HEADER
app.disable('Server')

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

require('./routes')(app) // Index Routes

const PORT = process.env.PORT || 5000
const server = require('http').createServer(app) // Create HTTP Server

server.listen(PORT, () => {
  console.log(`Server started on port : ${PORT}`)
  /* LOAD MONGODB */
  require('./configuration/mongoDb')
})
