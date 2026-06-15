import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/db/index.js';
import {users} from '../models/db/schema.js';
import {eq} from 'drizzle-orm';
import {migrateGuestToUser} from '../models/userModel.js';

const authRoutes = express.Router();

// Register
authRoutes.post('/register', async (req, res) => {
    //console.log('Register endpoint hit');
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
    }
    try{
        // Check if email already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if(existingUser.length >0){
            return res.status(400).json({ message: 'Email already in use' });
        }
        // Hash password
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);
        // Insert user into DB
        const newUser = await db.insert(users).values({username, email, hashPassword}).returning({id: users.id, username: users.username, email: users.email});

        //Migrate guest to user
        await migrateGuestToUser(req.cookies.guestId, newUser[0].id);
        res.clearCookie('guestId');

        // Generate JWT
        const token = jwt.sign(
            { userId: newUser[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )


        // Return the new user and token
        return res.status(201).json({ message: 'User created successfully', user: newUser[0], token });
    } catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Login
authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }
    try{
        // Find user by email
        const user = await db.select().from(users).where(eq(users.email, email));
        if(user.length === 0){
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user[0].hashPassword);
        if(!isMatch){
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT
        const token = jwt.sign(
            { userId: user[0].id },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        )
        //Send as httpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });

        await migrateGuestToUser(req.cookies.guestId, user[0].id);
        res.clearCookie('guestId');

        // Return user and token
        return res.status(200).json({ message: 'Login successful', user: { id: user[0].id, username: user[0].username }, token });
    } catch(error){
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

// Logout
authRoutes.post('/logout', (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logout successful' });
});

authRoutes.get('/me', async (req, res) => {
    if (req.user){
        const [user] = await db.select({id: users.id, username: users.username, email: users.email}).from(users).where(eq(users.id, req.user.userId));
        if(!user){
            res.clearCookie('token');
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ user });
    } else{
        return res.status(200).json({user: null});
    }
});

export default authRoutes;
