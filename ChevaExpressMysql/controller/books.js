const express = require('express');
const router = express.Router();

const { readBooks, readBook, createBook, updateBook, deleteBook } = require('../model/BookModel');

const { responseData, responseMessage } = require('../utils/responseHandler');

// Get all book
router.get('/', (req, res) => {
	readBooks(req, res, (result) => {
		return responseData(res, 200, result);
	})
});

// Get one book
router.get('/:id', (req, res) => {
	readBook(req, res, (result) => {
		if (result.length === 0) {
			return responseMessage(
				res,
				404,
				`Data buku dengan id ${req.params.id} tidak ditemukan`
			);
		}

		return responseData(res, 200, result[0]);
	})
});

//Create book
router.post('/create', (req, res) => {
	createBook(req, res, (result) => {
		if(result.affectedRows > 0){
			return responseMessage(
				res,
				201,
				'Berhasil menambah buku'
			);
		}
	});
});

//Update book
router.put('/update/:id', (req, res) => {
	updateBook(req, res, (result) => {
		if(result.changedRows == 0){
			return responseMessage(res, 400, 'Tidak ada data yang diubah');
		}

		return responseMessage(
			res,
			200,
			`Berhasil mengubah data buku dengan id = ${req.params.id}`
		);
	});
});

//Delete Book
router.delete('/delete/:id', (req, res) => {
	deleteBook(req, res, (result) => {
		if (result.affectedRows === 0) {
			return responseMessage(res, 400, 'Tidak ada data yang diubah');
		}

		return responseMessage(res, 200, `Berhasil menghapus data buku dengan id = ${req.params.id}`);
	});
});

module.exports = router;