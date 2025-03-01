//logic of what happens when you hit routes

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/auth.config.js";



export const signUp = async (req, res, next) => {
    //session of mongoose transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // hash the password if user doesnt exist
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // create a user 
        const newUsers = await user.create([{
            name,
            email,
            password: hashedPassword
        }], { session: session });

        // create a token
        const token = jwt.sign({userId: newUser[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});


        await session.commitTransaction();
        session.endSession();
        res.status(201).json({ success: true, message: 'User created successfully', data: { token, user: newUsers[0], } });
    // if anything goes wrong abort that transaction    
    }   catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }


}


export const signIn = async (req, res, next) => {
  
}



export const signOut = async (req, res, next) => {
    //implement signout logic
    try {
        res.clearCookie('token');
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
}   