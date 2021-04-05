const {
  responseMessage,
} = require('../utils/responseHandler');

const jwt = require('jsonwebtoken');

const tokenHandler = (req, res, next) => {
	const headerAuth = req.headers['authorization'];

	if(typeof headerAuth === 'undefined')
		return responseMessage(res, 403, 'Forbidden No Token');

	const token = headerAuth.split(' ')[1];

	jwt.verify(token, 'rahasia', (err, data) => {
		if(err) {
			return responseMessage(res, 403, 'Forbidden Invalid Token');
		}

		req.authData = data;
		next();
	})
}

module.exports = tokenHandler;