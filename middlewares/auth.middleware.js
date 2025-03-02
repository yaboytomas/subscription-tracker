import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

// someone is making a request to the server, we need to check if the user is authorized to make that request
const authorize = async (req, res, next) => {
    try {
        
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({ success: false, message: 'Unathorized' });
        }   

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found, not authorized.' });
        }

        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({ success: false, message: 'Unathorized', error: error.message });
        next(error);
    }
}

export default authorize;