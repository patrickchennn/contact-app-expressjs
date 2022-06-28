import * as con from "./utils/contacts.js";
import express from "express";
import bodyParser from "body-parser";
const app = express();
const port = 3000;

app.set("view engine","ejs");

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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


// send contact data
app.post('/add-contact', (req,res) => {
  console.log(req.body);
  con.addContact(req.body);
  res.redirect("/contacts");
  // res.send(req.body);
});


// add contact
app.get('/add-contact', (req, res) => {
  res.render("layouts/main", {
    title:"Add Contact",
    page:"add-contact.ejs",
    
  });
});

app.get('/contacts', (req, res) => {
  const contacts = con.getContacts();
  res.render("layouts/main", {
    title:"Contacts List",
    page:"contacts.ejs",
    contacts
  });
});

// get contact detail
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
