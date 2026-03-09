const bcrypt = require('bcrypt')
const Admin = require('../models/admin')
const { test, describe, beforeEach } = require('node:test')
const { adminsInDb } = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await Admin.deleteMany({})

    const passwordHash = await bcrypt.hash('secret', 10)
    const admin = new Admin({
      username: 'shut',
      name: 'Shimei Knut',
      password: passwordHash
    })

    await admin.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const adminsAtStart = await adminsInDb()
    
    const newAdmin = {
      username: 'shaje',
      name: 'Sharada Jeltje',
      password: 'shaje1234'
    }

    await api
      .post('/api/admins')
      .send(newAdmin)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    
    const adminsAtEnd = await adminsInDb()
    assert.strictEqual(adminsAtEnd.length, adminsAtStart + 1)

    const usernames = adminsAtEnd.map(admin => admin.username)
    assert(usernames.includes(newAdmin.username))
  })

  test('creation fails with proper status code and message if username is already taken', async () => {
    const adminsAtStart = await adminsInDb()

    const newAdmin = {
      username: 'shut',
      name: 'Shimei Knut',
      password: 'shut1234'
    }

    const result = await api
      .post('/api/admins')
      .send(newAdmin)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const adminsAtEnd = await adminsInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(adminsAtEnd.length, adminsAtStart.length)
  })
})