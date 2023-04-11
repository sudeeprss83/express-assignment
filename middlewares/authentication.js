const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports.authenticate = () => {
  return async function (req, res, next) {
    try {
      if (req.headers.authorization) {
        let decodedToken
        const accessToken = req.headers.authorization.split(' ')[1]

        try {
          decodedToken = await jwt.verify(
            accessToken,
            process.env.ACCESS_SECRET
          )
        } catch (error) {
          return res.status(403).json({ message: 'Invalid Token' })
        }
        const user = await User.findOne({ id: decodedToken._id })
        if (user.logoutTime == null) {
          req.user = decodedToken
          next()
        } else {
          return res.status(403).json({ message: 'Please login first' })
        }
      } else {
        return res.status(403).json({ message: 'Unauthorized' })
      }
    } catch (e) {
      console.log('Middleware Error : ', e)
      return res.status(500).json({
        status: 500,
        message: 'Middleware error',
      })
    }
  }
}
