import * as fs from 'fs';
import { constants } from 'buffer';
import chalk from 'chalk';

const orenji = chalk.hex("#FFA500");
const contactPath = "./data/contacts.json";

fs.access(contactPath, constants.F_OK, err => {
  // if file(contactPath) does not exist
  if(err){
    // then create a file with contactPath as a path
    // and put the user input data in it
    // CREATE
    console.log(chalk.red(`[-] contacts.json does not exist`));
    fs.mkdir("./data", err => {
      console.log(chalk.green(`[+] created automatically in ${contactPath}`));;
    });
    fs.writeFileSync(contactPath, `[]`, err => {
      if(err) throw err;
    });
  }
});

export const getContacts = () => {
  const rawData = fs.readFileSync(contactPath,{encoding:"utf-8"});
  const currContact = JSON.parse(rawData);

  return currContact;
}

export const getSpecificContact = (namae) => {
  const contacts = getContacts();
  return (contacts.find(contact => contact.name === namae));

}

/**
 * @contact an object that to be expected contains a name, email, phone number
 */
 export const addContact = (contact) => {
  fs.access(contactPath, constants.F_OK, err => {
    // if file(contactPath) does not exist
    if(err){
      // then create a file with contactPath as a path
      // and put the user input data in it
      console.log(chalk.red(`[-] contacts.json does not exist`));
      fs.mkdir("./data", err => {
        console.log(chalk.green(`[+] created automatically in ${contactPath}`));;
      });
      fs.writeFileSync(contactPath, `[${JSON.stringify(contact)}]`, err => {
        if(err) throw err;
      });
    }
    // if file(contactPath) does exist
    else{
      // then insert a new contact

      const currContact = getContacts();

      // before insert. check possible duplicate contact
      currContact.forEach(curr => {
        if(curr["name"]===contact["name"]){
          throw console.error(chalk.red(`[-] duplicate name is not possible!`));
          
        }
      });

      // insert part
      currContact.push(contact);
      
      // write to file part
      fs.writeFileSync(contactPath, JSON.stringify(currContact,null,'\t'), err => {
        if(err) throw err;
      });


    }
  })
}
