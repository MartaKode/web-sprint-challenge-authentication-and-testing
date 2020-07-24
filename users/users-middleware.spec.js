const userMiddleware = require('./users-middleware')

describe('isValid()', () => {

    it('should resond with Falsy if there is no username and/or password and Truthy otherwise', () => {
        const user = {
            username: 'marta',
            password: 'marta'
        }

        expect(userMiddleware.isValid(user)).toBeTruthy()
        expect(userMiddleware.isValid({username: 'marta'})).toBeFalsy()
    })

    it('should resond with Falsy if password is not a string', () => {
        const user = {
            username: 'marta',
            password: 123
        }

        expect(userMiddleware.isValid(user)).toBeFalsy()
    })

})