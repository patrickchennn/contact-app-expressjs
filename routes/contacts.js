import express from "express";
import multer from "multer";
import {ContactModel} from "../utils/contact.js";
import chalk from "chalk";
import validator from "validator";
import fs from "fs";

const ungu = chalk.magenta;
const orenji = chalk.hex("#FFA500");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/imgs/')
  },
  filename: (req, file, cb) => {
    cb(null,Date.now()+file.originalname)
  }
});

const upload = multer({ storage: storage });
const contactRouter = express.Router();


// contacts page
contactRouter.get('', async (req, res) => {
  if(req.query.deleteall){
    console.log(chalk.green("[+] all contacts were deleted"));
    await ContactModel.deleteMany({});
    res.redirect(req.get('referer'));
    return;
  }
  const contacts = await ContactModel.find();

  res.render("layouts/main", {
    title:"Contacts List",
    page:"contact-pages/contacts.ejs",
    contacts,
    msg: req.flash('msg'),
  });
});

// send the new data(edit page)
contactRouter.post('/edit-contact',upload.single('photoProfile'), async (req,res) => {
  const data = req.body;
  const photoProfile = req.file;
  
  console.log(ungu(`[info] new data for ${data.oldName}:
  ${JSON.stringify(data,null,'\t')}`));
  console.log(photoProfile);
  const errorMaps = new Map();
  
  // email is not required.
  // If the user decide to put email, check it 
  if(data.email.length > 0 && !validator.isEmail(data.email)){
    // and put it on map if it's invalid.
    errorMaps.set("email",data.email);
  }

  // phone number is required.
  // If the phone number is invalid,
  if(!validator.isMobilePhone(data.phoneNumber,'any')){
    errorMaps.set("phoneNumber",data.phoneNumber);
  }

  // if there is a duplicate name
  if(data.oldName===data.newName || await ContactModel.findOne({name:data.newName})!=null){
    errorMaps.set("newName",data.newName);
  }

  data[photoProfile.fieldname] = {
    data: fs.readFileSync(photoProfile.path),
    contentType: photoProfile.mimetype,
    path: photoProfile.filename,
  }

  // if there is an error
  if (errorMaps.size > 0) {
    console.log(chalk.red("[-] error when editing"));
    console.log(errorMaps);

    res.render("layouts/main",{
      title:"Add Contact",
      page:"contact-pages/edit-contact.ejs",
      errorMaps,
      contact:data,
    });
  }else{
    console.log(chalk.green("[+] no error when editing"));
    console.log(data);
    await ContactModel.updateOne(
      {
        name:data.oldName,
      },
      {
        $set: {
          name:data.newName,
          phoneNumber:data.phoneNumber,
          email:data.email,
          photoProfile:data.photoProfile,
          desc:data.desc,
        }
      }
    )
    req.flash("msg",`${data.oldName} contact is updated!`);
    res.redirect("/contacts");
  }
});

// delete contact page with name as an id
contactRouter.get('/delete/:namae', async (req, res) => {
  const namae = req.params.namae;
  console.log(orenji(`[*] deleting contact with name: ${namae}`));

  // const contact = con.getSpecificContact(namae);
  const contact = await ContactModel.findOneAndDelete({name:namae});
  if(contact==null){
    res.status(404);
    res.send("<h1>404</h1>");
  }else{
    req.flash("msg",`${namae} is deleted!`);
    res.redirect("/contacts");
  }
});

// edit-contact page 
contactRouter.get('/edit-contact/:namae', async (req, res) => {
  const namae = req.params.namae;
  console.log(orenji(`[*] editing contact with name: ${namae}`));

  const contact = await ContactModel.findOne({name:namae});
  // if(conctact===null){
  if(!contact){
    res.status(404).send("<h1>404 Not Found</h1>");
  }else{
    res.render("layouts/main", {
      title:"Edit Contact",
      page:"contact-pages/edit-contact.ejs",
      contact,
    });
  }
});

// detail page
contactRouter.get('/:namae', async (req, res) => {
  const namae = req.params.namae;
  const contact = await ContactModel.findOne({name:namae});
  console.log(ungu(`[info] detail contact for:${namae}`));
  res.render("layouts/main", {
    title:"contacts page",
    page:"contact-pages/detail.ejs",
    contact,
    namae
  });
});

export default contactRouter;