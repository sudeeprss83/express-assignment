const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = new Schema(
  {
    ref_email: { type: String },
    validation_hash: { type: String },
    validation_type: { type: String },
    is_expired: { type: String },
    is_verified: { type: String },
  },
  { timestamps: true }
)

const Token = mongoose.model('Token', tokenSchema)
module.exports = Token
