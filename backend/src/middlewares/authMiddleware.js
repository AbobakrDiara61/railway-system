import jwt from 'jsonwebtoken';
import { retrieveUser } from '../queries/users.repository.js';

const protect = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if(!token) 
            return res.status(401).json({ success: false, message: "Unauthorized: No Token Provided" });
        
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if(!decoded) 
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
        const { user_id } = decoded;
        const user = await retrieveUser(user_id);
        if(!user) 
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
        req.user = user;
        next();
    } catch (error) {
        console.error("Error In authentication middleware", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}
export {
    protect 
};