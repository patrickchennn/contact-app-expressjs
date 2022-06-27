import * as fs from 'fs';
import { constants } from 'buffer';
import chalk from 'chalk';

const orangeColor = chalk.hex("#FFA500");
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
