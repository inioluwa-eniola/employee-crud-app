const employeesRouter = require('express').Router()
const Employee = require('../models/employee')
const Admin = require('../models/admin')
const jwt = require('jsonwebtoken')

employeesRouter.get('/', async (request, response) => {
  const employees = await Employee.find({}).populate('admin')
  response.json(employees)
})

employeesRouter.get('/:id', async(request, response, next) => {
  const employee = await Employee.findById(request.params.id)
  try {
    if(employee) {
      response.json(employee)
    } else {
      response.status(404).end()
    }
  } catch(error) {
    next(error)
  }
})

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  } else { 
    return null
  }
}

employeesRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    
    console.log('This is the decoded token', decodedToken)
    
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const admin = await Admin.findById(decodedToken.id)

    if(!admin) {
      return response.status(400).json({ error: 'AdminId missing or not valid' })
    }

    const newEmployee = new Employee ({
      imageUrl: body.imageUrl,
      name: body.name,
      email: body.email,
      role: body.role,
      salary: body.salary,
      status: body.status,
      gender: body.gender,
      admin: admin._id
    })

    const savedEmployee = await newEmployee.save()
    admin.employees = admin.employees.concat(savedEmployee._id)
    await admin.save()

    if (savedEmployee) {
      response.status(201).json(savedEmployee)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

employeesRouter.put('/:id', async (request, response) => {
  try {
    const { imageUrl, name, email, role, salary, status, gender } = request.body
    const employee = await Employee.findById(request.params.id)
    
    if(!employee) {
      return response.status(404).end()
    }  
  
    employee.email = email
    employee.gender = gender
    employee.imageUrl = imageUrl
    employee.name = name
    employee.role = role
    employee.salary = salary
    employee.status = status
  
    const updatedEmployee = await employee.save()

    if(updatedEmployee) {
      response.status(201).json(updatedEmployee)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})  

employeesRouter.delete('/:id', async (request, response, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(request.params.id)
    if(!employee) {
      return response.status(404).end()
    } else {
      response.status(204).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = employeesRouter
