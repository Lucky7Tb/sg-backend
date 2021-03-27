const conn = require('../config/database');

exports.loginAuthor = ({username, password}) => {
  const sql = 'SELECT * FROM author WHERE username = ? AND password = ?';

  return new Promise((resolve, reject) => {
    conn.query(sql, [username, password], (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};
