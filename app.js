import * as con from "./utils/contacts.js";
import express from "express";
import bodyParser from "body-parser";
import chalk from "chalk";
import validator from "validator";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";

const orenji = chalk.hex("#FFA500");
const ungu = chalk.magenta;

const app = express();
const port = 3000;
app.listen(port, () => {
  console.log(`app is listening on port localhost:${port}`)
});

// template engine
app.set("view engine","ejs");

// middleware
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

// root/index page
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
app.post('/add-contact', (req,res) => {
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
      req.flash("msg","data contact is deleted!");
      res.redirect("/contacts");
    }

  }
);

// add-contact page
app.get('/add-contact', (req, res) => {
  res.render("layouts/main", {
    title:"Add Contact",
    page:"add-contact.ejs",
  });
});

// contacts page
app.get('/contacts', (req, res) => {
  const contacts = con.getContacts();
  res.render("layouts/main", {
    title:"Contacts List",
    page:"contacts.ejs",
    contacts,
    msg: req.flash('msg'),
  });
});

// delete contact with name as an id
app.get('/contacts/delete/:namae', (req, res) => {
  const namae = req.params.namae;
  console.log(orenji(`[*] deleting contact with name: ${namae}`));

  // const contact = con.getSpecificContact(namae);
  const contact = con.deleteContact(namae);

  if(!contact){
    res.status(404);
    res.send("<h1>404</h1>");
  }else{
    req.flash("msg",`${namae} contact is deleted!`);
    res.redirect("/contacts");
  }
});

// TODO: delete all contacts


// edit-contact page
// edit contact with name as an id
app.get('/contacts/edit-contact/:namae', (req, res) => {
  const namae = req.params.namae;
  console.log(orenji(`[*] editing contact with name: ${namae}`));

  const contact = con.getSpecificContact(namae);
  if(!contact){
    res.status(404);
    res.send("<h1>404</h1>");
  }else{
    res.render("layouts/main", {
      title:"Edit Contact",
      page:"edit-contact.ejs",
      contact,
    });
  }
});

// send the new data(edit page)
app.post('/contacts/edit-contact', (req,res) => {
  const data = req.body;
  console.log(ungu(`[info] new data:\n${JSON.stringify(data,null,'\t')}`));
  console.log(data.oldName);
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
  if(data.oldName!=data.name && con.isDuplicate("name",data.name)){
    errorMaps.set("name",data.name);
  }

  console.log(errorMaps);
  // if there is an error
  if (errorMaps.size > 0) {
    console.log(chalk.red("[-] error at editing"));
    res.render("layouts/main",{
      title:"Add Contact",
      page:"edit-contact.ejs",
      errorMaps,
      contact:data,
    });
  }else{
    console.log(chalk.green("[+] no error at editing"));
    con.updateContacts(data);
    req.flash("msg","data contact is updated!");
    res.redirect("/contacts");
  }
});


// detail page
// get contact detail page with name as an id
app.get('/contacts/:namae', (req, res) => {
  const namae = req.params.namae;
  const contact = con.getSpecificContact(namae);
  console.log(`
    detail contact for:
    ${chalk.cyan(JSON.stringify(contact,null,'\t'))}
  `);
  res.render("layouts/main", {
    title:"contacts page",
    page:"detail.ejs",
    contact,
    namae
  });
});
