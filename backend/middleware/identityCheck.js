import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {v4 as uuidv4} from 'uuid';

export const identifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            return next();
        } catch (err){
            res.clearCookie('token');
            res.status(401).json({ message: 'Invalid token' });
        }

    } 

    if (req.cookies.guestId) {
        req.guest = {id: req.cookies.guestId};
    } else{
        const guestId = uuidv4();
        res.cookie('guestId', guestId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000,
        });
        req.guest = { id: guestId };
    }
    next();
}

export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}

