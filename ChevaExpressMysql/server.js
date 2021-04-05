const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;
const errorHandler = require('./middleware/error');

const fileUpload = require('express-fileupload');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'public')));

// Test Server
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

app.use('/books', require('./controller/books'));

app.use('/author', require('./controller/author'));

app.use(errorHandler);

// Listening port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
