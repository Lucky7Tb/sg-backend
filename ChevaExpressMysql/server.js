const express = require('express');
const app = express();
const PORT = 3000 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Test Server
app.get('/', (req, res) => {
  res.status(200).send('Server is running!');
});

app.use('/books', require('./controller/books'));

// Listening port
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`);
});
