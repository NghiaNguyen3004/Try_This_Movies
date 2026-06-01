import jwt from 'jsonwebtoken';
import 'dotenv/config';
import {v4 as uuidv4} from 'uuid';

export const identifyUser = (req, res, next) => {
    //console.log('IdentifyUser middleware hit');
    const token = req.cookies.token;
    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch(error){
            res.clearCookie('token');
            return res.status(401).json({ message: 'Invalid token' });
        }
    } 
    // if no token, check for guestId cookie and assign it to req.guestId for tracking guest recommendations
    if (!req.cookies.guestId) {
        const guestId = uuidv4();
        res.cookie('guestId', guestId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 hours
        });
        req.guestId = guestId;

    } else{
        req.guest = {id: req.cookies.guestId};
    }

    next();
}

export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
}

