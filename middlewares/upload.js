const multer = require('multer')
const path = require('path')
const _ = require('lodash')

const upload = (fields, destination, mimeType) => {
	try {
		return multer({
			storage: multer.diskStorage({
				destination: destination,
				filename: function (req, file, cb) {
					cb(
						null,
						`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
					)
				},
			}),
			limits: {
				fileSize: 200000000,
			},
			fileFilter: (req, file, cb) => {
				if (_.includes(mimeType, file.mimetype) || mimeType.length === 0) {
					cb(null, true)
				} else {
					cb(null, false)
				}
			},
		}).fields(fields)
	} catch (error) {
		console.log('error occured -->', error)
		return error
	}
}

module.exports = { upload }
