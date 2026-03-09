const bcrypt = require('bcrypt')
const adminsRouter = require('express').Router()
const Admin = require('../models/admin')

adminsRouter.get('/', async (request, response) => {
  const admins = await Admin.find({}).populate('employees')
  response.json(admins)
})

adminsRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body 
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const admin = new Admin({
      username: username,
      name: name,
      passwordHash: passwordHash
    })
  
    const savedAdmin = await admin.save()
    
    response.status(201).json(savedAdmin)
  } catch (error) {
      next(error)
  }
})

module.exports = adminsRouter 