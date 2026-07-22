import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    required: true,
    type: String,
    minlength: 3
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    sparse: true,
    unique: true,
    match: /^[6-9][0-9]{9}$/
  },
  email: {
    unique: true,
    lowercase: true,
    sparse: true,
    trim: true,
    type: String,
    match: /^\S+@\S+\.\S+$/
  },
  profile_picture: {
    type: String,
    default: null,
    trim: true
  },
  age: {
    required: false,
    type: Number
  },
  
}, {timestamps: true})

userSchema.pre("validate", next => {
  if(!name && !email){
    return next(new Error("Either email or phone number is required."))
  }
})

const userModel = mongoose.model('User', userSchema);

export default userModel;