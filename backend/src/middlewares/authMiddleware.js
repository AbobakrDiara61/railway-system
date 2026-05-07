import jwt from 'jsonwebtoken';

const protect = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) 
            return res.status(401).json({ success: false, message: "Unauthorized: No Token Provided" });
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        if(!decoded) 
            return res.status(401).json({ success: false, message: "Unauthorized: Invalid Token" });
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error In authentication middleware", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export {
    protect 
};