const { User, History } = require('../models')
const { signToken } = require('../helpers/jwt')
const { checkPassword } = require('../helpers/bcryptjs')

class ControllerUser {
  static async login(req, res, next) {
    const { email, password } = req.body
    try {
      const result = await User.findOne({ where: { email } })
      if (result) {
        if (checkPassword(password, result.password)) {
          const access_token = signToken({ id: result.id, email: result.email, role: result.role })
          await History.create({
            riwayat: `Seorang user terdeteksi sedang login`,
            UserId: result.id
          })
          res.status(200).json({ id: result.id, email: result.email, role: result.role, access_token })
        } else {
          throw ({ name: 'Email/Password is wrong' })
        }
      } else {
        throw ({ name: 'Email/Password is wrong' })
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ControllerUser