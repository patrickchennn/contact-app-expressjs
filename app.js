import * as con from "./utils/contacts.js";
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
  const contacts = con.getContacts();
  
  res.render("layouts/main", {
    title:"contacts page",
    page:"contacts.ejs",
    contacts
  });
});

app.get('/contacts/:name', (req, res) => {
  const namae = req.params.name;
  console.log(namae);
  const contact = con.getSpecificContact(namae);
  console.log(contact);
  res.render("layouts/main", {
    title:"contacts page",
    page:"detail.ejs",
    contact,
    namae
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
