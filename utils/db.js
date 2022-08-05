import mongoose from 'mongoose';

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/contact-app-expressjs');
}

main().catch(err => console.log(err));
