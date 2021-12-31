import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config();

import User from '../models/user.js';

export const signin = async (req,res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({ email })
        if(!existingUser) return res.status(404).json({ message: 'Invalid credentials. Please try again' })

        const isCorrectPass = await bcrypt.compare(password, existingUser.password)
        if(!isCorrectPass) res.status(404).json({ message: 'Invalid credentials. Please try again' })

        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, `${process.env.JWT_SECRET}`, {expiresIn: "1h"})
        res.status(200).json({result: existingUser, token})
    } catch (error) {
        res.status(500).json({message: 'Something went wrong'})
    }

}

export const signup = async (req,res) => {
    const {email, password, confirmPassword, firstName, lastName} = req.body;

    try {
        const existingUser = await User.findOne({ email })
        if(existingUser) return res.status(400).json({ message: 'An account using this email already exist' }) 
        
        if(password !== confirmPassword) return res.status(400).json({message: "Passwords don't match"})

        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}`})
        const token = jwt.sign({email: result.email, id: result._id}, `${process.env.JWT_SECRET}`, {expiresIn: "1h"})
        res.status(200).json({result, token})
    } catch (error) {
        res.status(500).json({message: 'Something went wrong'})
    }
}



