const express = require('express')
const app = express()
const port = 3000


app.set("view engine","ejs");

app.get('/', (req, res) => {

  res.render("index",{test:"oi"});
})

app.get('/about', (req, res) => {
  res.render("about");
})

app.get('/contacts', (req, res) => {
  res.render("contacts");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
