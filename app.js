import * as con from "./utils/contacts.js";
import express from "express";
import bodyParser from "body-parser";
import chalk from "chalk";
const orenji = chalk.hex("#FFA500");

import validator from "validator";

import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";

const app = express();
const port = 3000;

app.set("view engine","ejs");

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// flash configuration
app.use(cookieParser("secret"));
app.use(flash());
app.use(session({
  cookie: {maxAge:6000},
  secret:'secret',
  resave:true,
  saveUninitialized:true,
}));

// root page
app.get('/', (req, res) => {
  res.render("layouts/main", {
    title:"index page",
    page:"index.ejs"
  });
})

// about page
app.get('/about', (req, res) => {
  res.render("layouts/main", {
    title:"about page",
    page:"about.ejs"
  });
});

// send contact data
app.post(
  '/add-contact',
  // callback
  (req,res) => {
    const data = req.body;
    console.log(orenji(JSON.stringify(data,null,'\t')));

    const errorMaps = new Map();
    
    // email is not required.
    // If the user decide to put email, check it 
    if(data.email.length > 0 && !validator.isEmail(data.email)){
      // and put it on map if it's invalid.
      errorMaps.set("email",data.email);
    }

    // phone number is required.
    // If the phone number is invalid,
    if(!validator.isMobilePhone(data.phoneNum,'id-ID')){
      errorMaps.set("phoneNum",data.phoneNum);
    }

    // if there is a duplicate name
    if(con.isDuplicate("name",data.name)){
      errorMaps.set("name",data.name);
    }

    console.log(errorMaps);
    // if there is an error
    if (errorMaps.size > 0) {
      console.log(chalk.red("[-] error"));
      res.render("layouts/main",{
        title:"Add Contact",
        page:"add-contact.ejs",
        errorMaps,
      });
    }else{
      console.log(chalk.green("[+] not error"));
      console.log(data);
      con.addContact(data);
      req.flash("msg","data contact is registered!")
      res.redirect("/contacts");
    }

  }
);


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
    contacts,
    msg: req.flash('msg'),
  });
});

// get contact detail with given id
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
  console.log(`Example app listening on port localhost:${port}`)
});
