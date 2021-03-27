const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middleware/async');

const { loginAuthor } = require('../model/AuthorModel');
const { authorValidation } = require('../utils/validation');

const {
  responseMessage,
  responseError,
} = require('../utils/responseHandler');


router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = req.body;

    const validateError = authorValidation(data);

    if (validateError) {
      return responseError(res, 400, validateError, 'Bad request');
    }

		const author = await loginAuthor(data);

		if(author.length === 0) responseMessage(res, 401, 'Username dan Password salah');

		jwt.sign({author: author[0].name}, 'rahasia', (err, token) => {
			responseMessage(res, 200, {
				token
			})
		})
  })
);

module.exports = router;
