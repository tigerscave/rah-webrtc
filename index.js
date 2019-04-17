const express = require('express');
const app = express();
const path = require('path')
const port = process.env.PORT || 3000

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});



// app.get('/main.js', (req, res) => {
//   res.sendFile(__dirname + '/main.js');
// });

app.listen(port);
