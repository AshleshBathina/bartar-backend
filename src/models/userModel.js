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
    unique: true
  },
  email: {
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    type: String,
    match: '/^\S+@\S+\.\S+$/'
  },
  age: {
    required: false,
    type: Number
  },
  
}, {timestamps: true})

const userModel = mongoose.model('User', userSchema);

export default userModel;