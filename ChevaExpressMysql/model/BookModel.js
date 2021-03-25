const conn = require('../config/database');

const { responseError, responseMessage } = require('../utils/responseHandler');

exports.readBooks = () => {
	const sql = 'SELECT * FROM books';

	return new Promise((resolve, reject) => {
		conn.query(sql, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
};

exports.readBook = (id) => {
  const sql = 'SELECT * FROM books WHERE id = ?';

	return new Promise((resolve, reject) => {
		conn.query(sql, id, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

exports.createBook = (data) => {
	const sql = 'INSERT INTO books SET ?';

	return new Promise((resolve, reject) => {
		conn.query(sql, data, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

exports.updateBook = (id, data) => {
	const sql = 'UPDATE books SET ? WHERE id = ?';

	return new Promise((resolve, reject) => {
		conn.query(sql, [data, id], (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}

exports.deleteBook = (id) => {
	const sql = 'DELETE FROM books WHERE id = ?';

	return new Promise((resolve, reject) => {
		conn.query(sql, id, (err, result) => {
			if (err) {
				return reject(err);
			}
			return resolve(result);
		});
	});
}