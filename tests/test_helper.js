const Employee = require('../models/employee')
const Admin = require('../models/admin')

const initialEmployees = [
  { 
    name: 'John Daley', 
    email: 'jaley@gmail.com',
    role: 'Developer',
    salary: '120000',
    status: 'active',
    gender: 'male'
  },
  { 
    name: 'Jane Doe', 
    email: 'jdoe@gmail.com',
    role: 'Manager',
    salary: '240000',
    status: 'active',
    gender: 'female'
  }
]

const nonExistingId = async () => {
  const employee = new Employee({ 
    name: 'Jacob Ward',
    email: 'jward@gmail.com',
    role: 'ML Engineer',
    salary: '500000',
    status: 'active',
    gender: 'male'
  })

  await employee.save()
  await employee.deleteOne()

  return employee._id.toString()
}

const employeesInDb = async () => {
  const employees = await Employee.find({})
  return employees.map(employee => employee.toJSON())
}

const adminsInDb = async () => {
  const admins = await Admin.find({})
  return admins.map(admin => admin.toJSON())
}

module.exports = { initialEmployees, nonExistingId, employeesInDb, adminsInDb }