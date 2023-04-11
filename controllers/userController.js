const User = require('../models/user')
const Token = require('../models/token')
const jwt = require('jsonwebtoken')
const mail = require('../helpers/sendMail')

// register user
module.exports.registerUser = async (req, res) => {
  try {
    let { username, email, password, phone } = req.body

    const duplicateCheck = await User.findOne({ username })
    if (duplicateCheck) {
      return res
        .status(200)
        .json({ status: false, message: 'Username Exists!!' })
    }
    const user = new User({
      username: username,
      password: password,
      phone: phone,
      email: email,
    })
    const profile = await user.save()
    return res
      .status(200)
      .json({ status: true, profile: profile, message: 'Success!!' })
  } catch (error) {
    console.log('error occured -->', error)
    return res.status(500).json({
      status: false,
      message: error.message,
      error,
    })
  }
}

// user logout route
module.exports.userLogout = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
  if (user) {
    user.logoutTime = new Date()
    await user.save()
    res
      .status(200)
      .send({ status: 401, msg: 'logged out successfully' })
  } else {
    res
      .status(401)
      .send({ status: 401, msg: 'Username or password did not match' })
  }
}

module.exports.userLogin = async (req, res) => {
  const user = await User.findOne({ username })
  if (user) {
    if (user.password === md5(req.body.password)) {
      const newuser = { id: user._id, email: user.email }
      // updating logout time to null
      user.logoutTime = null
      await user.save()
      const accessToken = generateAccessToken(newuser)

      res.status(200).json({
        status: 200,
        msg: 'Sucessfully logged in',
        data: {
          accessToken,
        },
      })
    } else {
      res
        .status(401)
        .send({ status: 401, msg: 'Username or password did not match' })
    }
  } else {
    res
      .status(401)
      .send({ status: 401, msg: 'Username or password did not match' })
  }
}

// show user details
module.exports.fetchProfile = async (req, res) => {
  try {
    const { _id } = req.body
    const profile = await User.findOne({ _id })
    if (profile) {
      for (const key in profile.uploads) {
        if (profile.uploads[key])
          profile.uploads[
            key
          ] = `${process.env.BASE_URL}${profile.uploads[key]}`
      }
      return res
        .status(200)
        .json({ status: true, profile: profile, message: 'User Found!!' })
    } else {
      return res
        .status(404)
        .json({ status: false, message: 'User Not Found!!' })
    }
  } catch (error) {
    console.log('error occured -->', error)
    return res.status(500).json({
      status: false,
      message: error.message,
      error,
    })
  }
}

//forgot password route
module.exports.userForgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (user) {
    const data = await generateValidationToken(user.email)
    await new Token(data).save()
    const options = {
      from: 'no-reply@gmail.com',
      to: user.email,
      subject: 'Reset Account password',
      text: 'Please click this link to reset your password!',
      html: `<b>${process.env.URL}/api/reset-password/${data.validation_hash}</b>`,
    }
    try {
      const sent = await mail.sendMailToUser(options)
      if (sent) {
        res
          .status(200)
          .send({ status: 200, msg: 'Mail sent! Please check your email' })
      } else {
        res.status(403).json({
          status: 403,
          msg: 'Email address invalid',
        })
      }
    } catch (error) {
      res.status(403).json({
        status: 403,
        msg: 'something went wrong',
      })
    }
  } else {
    res.status(403).json({
      status: 403,
      msg: 'Email is not registered',
    })
  }
}

module.exports.uploadImage = async (req, res) => {
  try {
    const { id } = req.params
    const image = req.files['userPic'][0]

    const update = await User.updateOne(
      { _id: id },
      {
        $set: { userPic: image },
      }
    )

    return res.json({ status: 200, update, message: 'images uploaded' })
  } catch (error) {
    console.log('Error ===>', error)
    return res.status(500).json({
      status: false,
      message: error.message,
      error,
    })
  }
}

const generateValidationToken = async (email) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ email }, process.env.ACCESS_SECRET_KEY, (err, token) => {
      data = {
        ref_email: email,
        validation_type: 'forget_password',
        validation_hash: token,
        is_expired: 1,
        is_verified: 1,
      }
      resolve(data)
      if (err) {
        reject(err)
      }
    })
  })
}
