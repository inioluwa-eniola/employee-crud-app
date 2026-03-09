const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Employee = require('../models/employee')
const { initialEmployees, nonExistingId, employeesInDb } = require('./test_helper')

const api = supertest(app)

describe('when there is initially some employees saved', () => {
  beforeEach(async () => {
    await Employee.deleteMany({})
    await Employee.insertMany(initialEmployees)
  })
  
  test('employees are returned as json', async () => {
    await api
      .get('/api/employees')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all employees are returned', async() => {
    const response = await api.get('/api/employees')
    
    assert.strictEqual(response.body.length, initialEmployees.length)
  })
  
  test('a specific employee is within the returned employees', async () => {
    const response = await api.get('/api/employees')
  
    const employees = response.body.map(e => e.name)
    assert.strictEqual(employees.find(name =>  name === 'John Daley'), 'John Daley')
  })
  
  describe('viewing a specific employee', () => {
    test('succeeds with a valid id', async () => {
      const employeesAtStart = await employeesInDb()
      const employeeToView = employeesAtStart[0]
      
      const resultEmployee = await api
        .get(`/api/employees/${employeeToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      assert.deepStrictEqual(resultEmployee.body, employeeToView)
    })
  
    test('fails with status code 404 if employee does not exist', async () => {
      const validNoneExistingId = await nonExistingId()
  
      await api.get(`/api/employees/${validNoneExistingId}`).expect(404)
    })
  
    test('fails with status code 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'
  
      await api.get(`/api/employees/${invalidId}`).expect(400)
    })
  })
  
  describe('addition of a new employee', () => {
    test('succeeds with valid data', async () => {
      const newEmployee = {
        name: 'John Fricks', 
        email: 'jricks@gmail.com',
        role: 'AI Engineer',
        salary: '220000',
        status: 'active',
        gender: 'male'
      }
    
      await api
        .post('/api/employees')
        .send(newEmployee)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      
      const employeesAtEnd = await employeesInDb()
      assert.strictEqual(employeesAtEnd.length, initialEmployees.length + 1)
    
      const names = employeesAtEnd.map(employee => employee.name)
      assert(names.includes('John Fricks'))
    })

    test('fails with status code 400 if data invalid', async () => {
      const newEmployee = {
        email: 'jkook@gmail.com',
        role: 'ML Engineer',
        salary: '200000',
        status: 'active',
        gender: 'male'
      }

      await api
        .post('/api/employees')
        .send(newEmployee)
        .expect(400)

      const employeesAtEnd = await employeesInDb()

      assert.strictEqual(employeesAtEnd.length, initialEmployees.length)
    })
  })
  
  describe('deletion of an employee', () => {
    console.log('The deletion describe is entered')
    test('succeeds with status code 204 if id is valid', async () => {
      const employeesAtStart = await employeesInDb()
      const employeeToDelete = employeesAtStart[0]
      
      await api
        .delete(`/api/employees/${employeeToDelete.id}`)
        .expect(204)
      
      const employeesAtEnd = await employeesInDb()
      const ids = employeesAtEnd.map(employee => employee.id)
      assert(!ids.includes(employeeToDelete.id))
  
      assert.strictEqual(employeesAtEnd.length, initialEmployees.length - 1)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})


