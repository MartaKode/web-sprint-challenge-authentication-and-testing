const bcryptjs = require('bcryptjs') //encryption
const jwt = require('jsonwebtoken') //token

const router = require('express').Router();

const UserModel = require('../users/users-model');
const { isValid } = require('../users/users-middleware');

router.post('/register', (req, res) => {
  // implement registration
  // if (!req.body.username || !req.body.password) {
  //   res.status(400).json({ message: 'Must provide required fields username and/or password' })
  // }

if(isValid(req.body)){
  const rounds = process.env.BCRYPT_ROUNDS || 12

  //hashing password: 
  const hash = bcryptjs.hashSync(req.body.password, rounds)

  req.body.password = hash

  UserModel.addUser(req.body)
    .then(newUser => {
      const token = makeJWTToken(newUser)

      res.status(201).json({ data: newUser, token })
    })
    .catch(err => {
      UserModel.findUsers()
        .then(users => {
          if (users.map(user => user.username === req.body.username)) {
            res.status(400).json({ message: 'username must be unique' })
          } else {
            res.status(500).json({ error: err.message })
          }
        })

    })
} else {
    res.status(400).json({ message: 'Must provide required fields username and/or password where password should be alphanumeric' })

}


});

router.post('/login', (req, res) => {
  // implement login
  // if (!req.body.password || !req.body.username) {
  //   res.status(400).json({ message: 'Must provide required fields username and/or password' })
  // }

  const { username, password } = req.body

  if(isValid(req.body)){
  UserModel.findUsersBy({ username })
    .then(([user]) => {
      if (user && bcryptjs.compareSync(password, user.password)) {
        const token = makeJWTToken(user)

        res.status(201).json({ message: `Welcome to the API ${user.username}`, token })
      } else {
        res.status(401).json({ message: 'invalid credentials' })
      }
    })
    .catch(err => {
      res.status(500).json({ error: err.message })
    })
  }else {
    res.status(400).json({ message: 'Must provide required fields username and/or password' })
  }
});

//`````````TOKEN helpers``````````
function makeJWTToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  }

  const secret = process.env.JWT_SECRET || 'keept it secret, keep it safe!'

  const options = {
    expiresIn: '1h'
  }

  return jwt.sign(payload, secret, options)
}

module.exports = router;
