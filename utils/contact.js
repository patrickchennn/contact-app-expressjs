import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  img:
  {
    data: Buffer,
    contentType: String,
    path: String,
  }
});

const contactSchema = new mongoose.Schema({
  name:String,
  phoneNumber:String,
  photoProfile:{
    data: Buffer,
    contentType: String,
    path: String,
  },
  email:String,
  desc:String,
},{
  versionKey:false
})




const ContactModel = mongoose.model('Contact',contactSchema);
const ImageModel = mongoose.model("Image",imageSchema);
export {ContactModel,ImageModel};