import * as fs from 'fs';
import { constants } from 'buffer';
import chalk from 'chalk';

const orenji = chalk.hex("#FFA500");
const contactPath = "./data/contacts.json";

// if file(contactPath) does not exist
fs.access(contactPath, constants.F_OK, err => {
  if(err){
    // then create a file with contactPath as a path
    console.log(chalk.red(`[-] contacts.json does not exist`));
    fs.mkdir("./data", err => {
      console.log(chalk.green(`[+] created automatically in ${contactPath}`));;
    });
    // and put the data in that file afterwise
    saveContact("[]");
  }
});

/**
 * utility function for editing file
 */
export const saveContact = (contact) => {
  fs.writeFileSync(contactPath,contact, err => {
    if(err) throw err;
  });
}

/**
 * fetch data from contacts.json
 */
export const getContacts = () => {
  const rawData = fs.readFileSync(contactPath,{encoding:"utf-8"});
  const currContact = JSON.parse(rawData);
  return currContact;
}

export const addContact = (contact) => {
  if(isDuplicate("name",contact.name)) return;
  
  const contacts = getContacts();
  
  // insert part
  contacts.push(contact);
  
  // write to file part
  saveContact(JSON.stringify(currContact,null,'\t'));
}

/**
 * returns undefined if no elements are found.
 */
export const getSpecificContact = (namae) => {
  const contacts = getContacts();
  return (contacts.find(contact => contact.name === namae));
}

export const isDuplicate = (attr,value) => {
  const contacts = getContacts();
  for(const contact of contacts){
    if(contact[attr] === value) return true;
  }
  return false;
};

export const updateContacts = (editedContact) => {
  const contacts = getContacts();
  console.log(chalk.magenta(`[info] updateContact() is called]`));

  const idx = contacts.findIndex(c => c.name===editedContact.oldName);
  console.log("indx" + idx);
  // if we could not find the name
  if(idx === -1){
    // then log it
    console.error(
      // if name is not defined(name===undefined)
      ( chalk.white.bgRed.bold(`[-] ${editedContact.oldName} is not found `))
    );
    // and then return false to indicate that the contact does not exist
    return;
  }
  delete editedContact.oldName;
  contacts[idx] = editedContact;
  console.log(contacts);
  saveContact(JSON.stringify(contacts,null,'\t'));
}

export const deleteAllContacts = () => saveContact("[]");

export const deleteContact = (name) => {
  const contacts = getContacts();
  const idx = contacts.findIndex(c => c.name===name);

  // if we could not find the name
  if(idx === -1){
    // then log it
    console.error(
      // if name is not defined(name===undefined)
      ( chalk.white.bgRed.bold(`[-] ${!name ? "please specify name to be deleted" : `${name} is not found`}`) )
    );
    // and then return false to indicate that the contact does not exist
    return false;
  }

  // if we find the name, then remove the contact
  contacts.splice(idx,1); // this method is where we actually remove the contact
  // console.log(
  //   orenji(JSON.stringify(contacts,null,'\t'))
  // );

  saveContact(JSON.stringify(contacts,null,'\t'));

  console.log(chalk.green(`[+] ${name} is deleted from contact.`));
  return true;
}
