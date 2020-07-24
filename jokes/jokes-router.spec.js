const supertest = require('supertest')

const server = require('../api/server')

const db = require('../database/dbConfig')

describe('jokes-router', () => {
    beforeEach(async () => {
        await db('users').truncate()
    })

    describe('GET /api/jokes', () => {

        it('should respond with status 401 UNAUTHOIRIZED when not logged in', () => {
            return supertest(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.status).toBe(401)
            })
        })

        it('should respond with you shall not pass message when not logged in', () => {
            return supertest(server)
            .get('/api/jokes')
            .then(res => {
                expect(res.body.you).toContain('shall not pass')
            })
        })

        it('should respond with status 200 OK when logged in', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'frania', password: 'frania'})
            .then(res => {
                return supertest(server)
                .get('/api/jokes')
                .set({Authorization: res.body.token})
                .then(res => {
                    expect(res.status).toBe(200)
                })
            })
        })

        it('should respond with an array of 20 jokes when logged in', () => {
            return supertest(server)
            .post('/api/auth/register')
            .send({username: 'frania', password: 'frania'})
            .then(res => {
                return supertest(server)
                .get('/api/jokes')
                .set({Authorization: res.body.token})
                .then(res => {
                    expect(res.body).toHaveLength(20)
                })
            })
        })

    })
  

})