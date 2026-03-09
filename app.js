const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/logger')
const employeesRouter = require('./controllers/employees')
const adminsRouter = require('./controllers/admins')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const app = express()

logger.info('connecting to', MONGODB_URI)

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { family: 4 })
    console.log('connected to MongoDB') 
  } catch (error) {
    console.log('Error encountered when trying to connect to DB', error)
  }
}

connectToDb()

app.use(express.json())
app.use('/api/employees', employeesRouter)
app.use('/api/admins', adminsRouter)
app.use('/api/login', loginRouter)

app.use(middleware.requestLogger)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

module.exports = app