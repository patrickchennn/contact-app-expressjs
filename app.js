import * as contact from "./utils/contacts.js";
import express from "express";

const app = express();
const port = 3000;

app.set("view engine","ejs");

app.get('/', (req, res) => {
  res.render("layouts/main", {
    title:"index page",
    page:"index.ejs"
  });
})

app.get('/about', (req, res) => {
  res.render("layouts/main", {
    title:"about page",
    page:"about.ejs"
  });
});
app.get('/contacts', (req, res) => {
  const contacts = contact.getContact();
  
  res.render("layouts/main", {
    title:"contacts page",
    page:"contacts.ejs",
    contacts
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
