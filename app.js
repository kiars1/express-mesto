const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use((req, res, next) => {
  req.user = {
    _id: '6171c4022cc02cc42769725f'
  };

  next();
}); 

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
