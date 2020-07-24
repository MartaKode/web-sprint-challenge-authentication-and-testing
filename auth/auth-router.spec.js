const supertest = require('supertest')

const server  = require('../api/server')

const db = require('../database/dbConfig')

const bcryptjs = require('bcryptjs')

describe('auth-router', () => {
    beforeEach(async () => {

        
        await db('users').truncate()
        // await db('users').insert({username: 'frania', password: 'frania'})
    })

    describe('POST /api/auth/register', () => {

        it('should respond with status 201 OK', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'marta', password: 'marta'})
            .then(res => {
                expect(res.status).toBe(201)
            })
        })

        it('should respond with token', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'marta', password: 'marta'})
            .then(res => {
                expect(res.body.token).toBeDefined()
            })
        })

        it('should respond with new user', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'marta', password: 'marta'})
            .then(res => {
                expect(res.body.data.username).toBe('marta')
            })
        })


        it('should respond with status 400 when sending an empty object and a json msg', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({})
            .then(res => {
                expect(res.status).toBe(400)
                expect(res.type).toMatch(/json/i)
            })
        })
    })

    describe('POST api/auth/login', () => {
        beforeEach(async () => {
            const user = { username: 'frania', password: 'frania'}

            const hash = bcryptjs.hashSync(user.password, 12)

            user.password = hash

            await db('users').truncate()
            await db('users').insert(user)
        })
        it('should respond with status 201 OK', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'marta', password: 'marta'})
            .then(res => {
                return supertest(server)
                .post('/api/auth/login')
                .send({username: 'marta', password: 'marta'})
                .then( res => {
                    expect(res.status).toBe(201)
                })
            })
        })

        it('should respond with a welcome message', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'marta', password: 'marta'})
            .then(res => {
                return supertest(server)
                .post('/api/auth/login')
                .send({username: 'marta', password: 'marta'})
                .then( res => {
                    expect(res.body.message).toContain('Welcome')
                })
            })
        })

        it('should respond with json invalid credentials message when given wrong creds', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'marta', password: 'marta'})
            .then(res => {
                return supertest(server)
                .post('/api/auth/login')
                .send({username: 'marta', password: 'martaa'})
                .then( res => {
                    expect(res.type).toMatch(/json/i)
                    expect(res.body.message).toContain('invalid cred')
                })
            })
        })

        it('should respond with status 400 BAD REQUEST and a message about missing required fields', () => {
                return supertest(server)
                .post('/api/auth/login')
                .send({username: 'marta'})
                .then( res => {
                    expect(res.status).toBe(400)
                    expect(res.body.message).toContain('Must provide required fields')
                })
        })

        it('should respond with status 201 OK', () => {
        
            return supertest(server)
            .post('/api/auth/login')
            .send({username: 'frania', password: 'frania'})
            .then(res => {
                expect(res.status).toBe(201)
            })
        })

    })




})