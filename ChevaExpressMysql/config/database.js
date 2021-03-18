const mysql = require('mysql');

const conn = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'cheva_library',
});

conn.connect(err => {
	if(err) throw err;
	console.log("Mysql connected");
});

module.exports = conn;