import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{ 
        type: String, 
        required: [true, 'User name is requiered.'],
        trim: true,
        minLength: 2,
        minLength: 50,
    },

    email: {
        type: String,
        required: [true, 'User email is requiered.'],
        trim: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email'],
    },

    password: {
        type: String,
        required: [true, 'User password is requiered.'],
        minLength: 6,
    }

    // shows when user created or updated.
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;

