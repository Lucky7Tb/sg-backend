const conn = require('../config/database');

const { responseError, responseMessage } = require('../utils/responseHandler');

exports.readBooks = (req, res, callback) => {
	const sql = 'SELECT * FROM books';
	conn.query(sql, (err, result) => {
		if (err) {
			return responseError(res, 500, 'Kesalahan pada sisi server', err);
		}

		return callback(result);
	});
};

exports.readBook = (req, res, callback) => {
	const bookId = req.params.id;
    const sql = 'SELECT * FROM books WHERE id = ?';

	conn.query(sql, bookId, (err, result, field) => {
		if (err) {
			return responseError(res, 500, 'Kesalahan pada sisi server', err);
		}

		return callback(result);
	});
}

exports.createBook = (req, res, callback) => {
	const data = req.body;
	const sql = 'INSERT INTO books SET ?';

	conn.query(sql, data, (err, result) => {
		if (err) {
			return responseError(res, 500, 'Kesalahan pada sisi server', err);
		}

		return callback(result);
	});
}

exports.updateBook = (req, res, callback) => {
	const bookId = req.params.id;
  	const newBook = req.body;

	this.readBook(req, res, (result) => {
		if (result.length === 0) {
			return responseMessage(
				res,
				404,
				`Data buku dengan id ${bookId} tidak ditemukan`
			);
		}

		const sql = 'UPDATE books SET ? WHERE id = ?';

		conn.query(sql, [newBook, bookId], (err, result) => {
			if (err) {
				return responseError(res, 500, 'Kesalahan pada sisi server', err);
			}

			return callback(result);
		});
	});
}

exports.deleteBook = (req, res, callback) => {
	const bookId = req.params.id;
	const sql = 'DELETE FROM books WHERE id = ?';

	this.readBook(req, res, (result) => {
		if (result.length === 0) {
			return responseMessage(
				res,
				404,
				`Data buku dengan id ${bookId} tidak ditemukan`
			);
		}

		conn.query(sql, bookId, (err, result) => {
			if (err) {
				return responseError(res, 500, 'Kesalahan pada sisi server', err);
			}
			
			return callback(result);
		});
	});
}