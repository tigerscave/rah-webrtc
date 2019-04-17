const express = require('express');
const app = express();
const path = require('path')
const port = process.env.PORT || 3000

// app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/step-01.html');
});
app.get('/main.js', (req, res) => {
  res.sendFile(__dirname + '/main.js');
});

app.listen(port);
