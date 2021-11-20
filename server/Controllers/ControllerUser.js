const { User } = require('../models')
const { signToken } = require('../helpers/jwt')
const { checkPassword } = require('../helpers/bcryptjs')
// const { OAuth2Client } = require('google-auth-library')
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

class ControllerUser {
  static async register(req, res, next) {
    const { username, email, password, address } = req.body
    try {
      const result = await User.create({ username, email, password, role: "admin", address })
      res.status(201).json({
        id: result.id,
        email: result.email
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body // as requirement client
    try {
      const result = await User.findOne({ where: { email } })
      if (result) {
        if (checkPassword(password, result.password)) {
          const access_token = signToken({ id: result.id, email: result.email, role: result.role })
          res.status(200).json({ id: result.id, username: result.username, email: result.email, role: result.role, access_token })
        } else {
          throw ({ name: 'Unauthorized' })
        }
      } else {
        throw ({ name: 'Unauthorized' })
      }
    } catch (err) {
      next(err)
    }
  }

  // static async googleAuthLogin(req, res, next) {
  //   try {
  //     const ticket = await client.verifyIdToken({
  //       idToken: req.body.idToken,
  //       audience: process.env.GOOGLE_CLIENT_ID
  //     })
  //     const { email, name } = ticket.getPayload()
  //     const [user, created] = await User.findOrCreate({
  //       where: { email },
  //       defaults: {
  //         username: name,
  //         email,
  //         password: email,
  //         role: "admin",
  //       }
  //     })
  //     if (user) {
  //       const access_token = signToken({
  //         id: user.id,
  //         email: user.email,
  //         role: user.role
  //       })
  //       res.status(200).json({ id: user.id, username: user.username, role: user.role, email: user.email, access_token })
  //     }
  //   } catch (err) {
  //     next(err)
  //   }
  // }
}

module.exports = ControllerUser