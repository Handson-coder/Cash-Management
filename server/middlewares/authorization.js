const authorization = async (req, res, next) => {
    try {
      if (req.user.role == 'developer') {
        next()
      } else {
        throw ({ name: 'Forbidden' })
      }
    } catch (err) {
      next(err)
    }
  }
  
  module.exports = authorization