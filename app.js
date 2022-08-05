import express from "express";
import bodyParser from "body-parser";
import chalk from "chalk";
import validator from "validator";
import session from "express-session";
import cookieParser from "cookie-parser";
import flash from "connect-flash";
import "./utils/db.js";
import {ContactModel} from "./utils/contact.js";
import multer from "multer";
import fs from "fs";
import path from "path";
import contactRouter from './routes/contacts.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/')
  },
  filename: (req, file, cb) => {
    cb(null,Date.now()+file.originalname)
  }
});

const upload = multer({ storage: storage });
const cacheTime = 2592000; // 30 day
const orenji = chalk.hex("#FFA500");

const app = express();
const port = 3000;
app.listen(port,console.log(`app is listening on port http://localhost:${port}`));

// template engine
app.set("view engine","ejs");

// middleware
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 
app.use(express.static(path.resolve("public")));

// flash configuration
app.use(cookieParser("secret"));
app.use(flash());
app.use(session({
  cookie: {maxAge:6000},
  secret:'secret',
  resave:true,
  saveUninitialized:true,
}));

// root  or index page
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
app.post('/add-contact',upload.single('photoProfile'), async (req,res) => {
    const data = req.body;
    const photoProfile = req.file;
    console.log(photoProfile);
    console.log(orenji(JSON.stringify(data,null,'\t')));

    const errorMaps = new Map();
    
    // // email is not required.
    // // If the user decide to put email, check it 
    if(data.email.length > 0 && !validator.isEmail(data.email)){
      // and put it on map if it's invalid.
      errorMaps.set("email",data.email);
    }

    // phone number is required.
    // If the phone number is invalid,
    if(!validator.isMobilePhone(data.phoneNumber,'any')){
      errorMaps.set("phoneNumber",data.phoneNumber);
    }

    // will return null if, and only if there is not a duplicate(or there is no data about that whatsoever)
    // if != null it means that particular data exist
    // so there is a duplicate(if we insert it)
    if(await ContactModel.findOne({name:data.name})!=null){
      errorMaps.set("name",data.name);
    }

    data[photoProfile.fieldname] = {
      data: fs.readFileSync(photoProfile.path),
      contentType: photoProfile.mimetype,
      path: photoProfile.filename,
    }

    // if there is an error
    if (errorMaps.size > 0) {
      console.log(chalk.red("[-] error while adding new contact"));
      console.log(errorMaps);
      res.render("layouts/main",{
        title:"Add Contact",
        page:"contact-pages/add-contact.ejs",
        errorMaps,
      });
    }else{
      console.log(chalk.green("[+] no error while adding new contact"));
      console.log(data);
      ContactModel.insertMany(data);
      req.flash("msg",`${data.name} is added!`);
      res.redirect("/contacts");
    }
  }
);

// add-contact page
app.get('/add-contact', (req, res) => {
  res.render("layouts/main", {
    title:"Add New Contact",
    page:"contact-pages/add-contact.ejs",
  });
});

app.use('/contacts',contactRouter);
