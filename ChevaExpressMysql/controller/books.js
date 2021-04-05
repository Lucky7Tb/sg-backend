const express = require('express');
const router = express.Router();
const fs = require('fs');

const { readBooks, readBook, createBook, updateBook, deleteBook } = require('../model/BookModel');

const { bookValidation } = require('../utils/validation');
const { uploadValidation } = require('../utils/fileUpload');

const asyncHandler = require('../middleware/async');
const tokenHandler = require('../middleware/tokenValidation');

const { responseData, responseMessage, responseError} = require('../utils/responseHandler');
// const { loginAuthor } = require('../model/AuthorModel');

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
		const file = req.files;

    const validateError = bookValidation(data);

    if (validateError) {
      return responseError(res, 400, validateError, 'Bad request');
    }

		if (file === null || !file.cover) {
			return responseMessage(res, 400, "Cover can't be blank");
		}

		const fileValidation = uploadValidation(file.cover);
		if (!fileValidation.success) {
			return responseMessage(res, 400, fileValidation.result);
		}

		const filePath = `images/${fileValidation.result}`;
		const fileName = `${__dirname}/../public/`;

		data.cover = filePath;
		data.author = req.authData.author;

		file.cover.mv(`${fileName}${filePath}`, err => {
			if (err) {
				return responseMessage(res, 400, err);
			}
		});

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
	const file = req.files;

	const validateError = bookValidation(data);

	if (validateError) {
		return responseError(res, 400, validateError, 'Bad request');
	}

	const oneBook = await readBook(id);
	const isBookExist = oneBook.length === 1;

	if(!isBookExist){
		return responseMessage(res, 404, `Book with id ${id} not found`);
	}

	if (file !== null) {
		const fileValidation = uploadValidation(file.cover);
		if (!fileValidation.success) {
			return responseMessage(res, 400, fileValidation.result);
		}

		const filePath = `images/${fileValidation.result}`;
		const fileName = `${__dirname}/../public/`;

		data.cover = filePath;
		file.cover.mv(`${fileName}${filePath}`, (err) => {
			if (err) {
				return responseMessage(res, 400, err);
			}
		});

		if (fs.existsSync(`${fileName}${oneBook[0].cover}`)) {
			fs.unlink(`${fileName}${oneBook[0].cover}`, err => {
				if (err) {
					return responseMessage(res, 500, 'App Crash');
				}
			});
		}
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