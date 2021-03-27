const express = require('express');
const router = express.Router();

const { readBooks, readBook, createBook, updateBook, deleteBook } = require('../model/BookModel');

const { bookValidation } = require('../utils/validation');

const asyncHandler = require('../middleware/async');
const tokenHandler = require('../middleware/tokenValidation');

const { responseData, responseMessage, responseError} = require('../utils/responseHandler');

// Get all book
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const dataBook = await readBooks();
    return responseData(res, 200, dataBook);
  })
);

// Get one book
router.get('/:id', asyncHandler( async (req, res) => {
	const id = req.params.id;
	const oneBook = await readBook(id);

	if (oneBook.length === 0) {
    return responseMessage(res, 404, `Data buku dengan id ${id} tidak ditemukan`);
  }

	return responseData(res, 200, oneBook);
}))

//Create book
router.post('/create', tokenHandler, asyncHandler(async (req, res) => {
    const data = req.body;

    const validateError = bookValidation(data);

    if (validateError) {
      return responseError(res, 400, validateError, 'Bad request');
    }

		data.author = req.authData.author;

    const newBook = await createBook(data);
    if (newBook.affectedRows > 0) {
      return responseMessage(
        res,
        201,
        `Success created book with id ${newBook.insertId}`
      );
    }
  })
);

//Update book
router.put('/update/:id', asyncHandler( async (req, res) => {
	const id = req.params.id;
	const data = req.body;

	const validateError = bookValidation(data);

	if (validateError) {
		return responseError(res, 400, validateError, 'Bad request');
	}

	const oneBook = await readBook(id);
	const isBookExist = oneBook.length === 1;

	if(!isBookExist){
		return responseMessage(res, 404, `Book with id ${id} not found`);
	}
	
	const updatedBook = await updateBook(id, data);
	const isBookUpdated = updatedBook.changedRows > 0;
	if(isBookUpdated) {
		return responseMessage(res, 200, `Success update book with id ${id}`);
	}
}));

//Delete Book
router.delete('/delete/:id', asyncHandler(async (req, res) => {
	const id = req.params.id;
	
	const oneBook = await readBook(id);
	const isBookExist = oneBook.length === 1;

	if (!isBookExist) {
		return responseMessage(res, 404, `Book with id ${id} not found`);
	}

	const deletedBook = await deleteBook(id);
	const isDeleted = deletedBook.affectedRows > 0;

	if(isDeleted){
		return responseMessage(res, 200, `Success deleted book with id ${id}`);
	}
}));

module.exports = router;