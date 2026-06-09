import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {v4 as uuidv4} from 'uuid';

export const identifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (token){
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } else{
        //If no token, this is a guest session, assign a guest ID
        req.user = { id: `guest_${uuidv4()}` };
        next();
    }
}

export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}

