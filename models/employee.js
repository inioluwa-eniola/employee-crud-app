const mongoose = require('mongoose')
const { Schema, model } = mongoose 

const employeeSchema = new Schema({
  imageUrl: String,
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  salary: String,
  status: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
})

employeeSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Employee = model('Employee', employeeSchema)

module.exports = Employee 