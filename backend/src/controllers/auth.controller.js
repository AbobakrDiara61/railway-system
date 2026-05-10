import bcrypt from 'bcryptjs'
import validator from 'validator'

import { setupResponse/* , generateRefreshToken */ } from "../utils/auth.js";
import { 
    createUser,
    retrieveUserByEmail,
    retrieveUser,
    deleteUser,
    /* updateRefreshToken, */
} from '../queries/users.repository.js';

import { 
    sendVerificationEmail,
    sendWelcomeEmail,
    sendAccountDeletedEmail
} from "../utils/emails.js";

const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const [first_name, ...rest] = (name || '').split(' ');
        const last_name = rest.join(' ') || first_name;
        
        if(!validator.isEmail(email)) 
            throw new Error("Invalid email address");

        if(!validator.isStrongPassword(password))
            throw new Error("Password is not strong enough");

        const exits = await retrieveUserByEmail(email);
        if(exits) 
            return res.status(400).json({ message: "User already exists"});
        
        const password_hash = await bcrypt.hash(password, 10);
        const OTPCode = Math.floor(100000 + 900000 * Math.random());
        const OTPCodeExpiryDate = Date.now() + 3 * 60 * 1000;
        
        const user_id = await createUser({ 
            ...req.body,
            first_name,
            last_name,
            role: 'passenger',
            password: undefined,
            password_hash,
            OTPCode,
            OTPCodeExpiryDate
        });
        const user = await retrieveUser(user_id);

        const payload = { email, user_id, role: 'passenger' };
        const token = setupResponse(res, payload);

        await sendVerificationEmail(email, OTPCode);

        return res.status(201).json({ 
            success: true, 
            message: "User created successfully",
            token,
            user: {
                ...user,
                password_hash: undefined,
                OTPCode: undefined,
                OTPCodeExpiryDate: undefined,
                refresh_token: undefined
            } 
        });
        
    } catch (error) {
        console.error("Error in register controller", error);
        return res.status(500).json({ success: false, message: "The registration has failed" });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
  
        if(!email) 
            return res.status(400).json({ message: "Email is required" });
        if(!password) 
            return res.status(400).json({ message: "Password is required" });
        
        const user = await retrieveUserByEmail(email);
        if(!user)
            return res.status(404).json({ message: "User not found" });
        
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if(!isPasswordValid)
            return res.status(401).json({ message: "Invalid Password" });

        // const payload = { email, user_id: user._id };
        // // const refreshToken = generateRefreshToken({ user_id });
        // setupResponse(res, payload/* , refreshToken */);        
        
        const payload = { email, user_id: user.user_id, role: user.role };
const token = setupResponse(res, payload);

        // await updateRefreshToken(refreshToken);
      try {
    await sendWelcomeEmail(user.email, user.full_name);
} catch (emailError) {
    console.error("Email sending failed:", emailError.message);
}

   return res.status(200).json({ success: true, message: "Login successful", token, user: {
            ...user,
            password_hash: undefined,
            OTPCode: undefined,
            OTPCodeExpiryDate: undefined,
            refresh_token: undefined
        } });

    } catch (error) {
        console.error("Error In login controller", error);
        return res.status(500).json({ success: false, message: "The login has failed" });
    }
};

const logout = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await retrieveUser(user_id);
        if(!user)
            return res.status(404).json({ message: "User not found" });
        // await updateRefreshToken({ refreshToken: null, user_id });
        
        res.clearCookie('token');
        // res.clearCookie('refreshToken');
        return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.error("Error in Logout controller", error);
        return res.status(500).json({ success: false, message: "The logout has failed" });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { code } = req.body;
        const { user_id } = req.user;
        const user = await retrieveUser(user_id);
        if(!user)
            return res.status(404).json({ message: "User not found" });
        
        if(code !== user.OTPCode)
            return res.status(401).json({ message: "Incorrect OTP Code"});

        if(user.OTPCodeExpiryDate < Date.now()) 
            return res.status(401).json({ message: "OTP Code has expired"});
        
        
        // user.isVerified = true;
        // user.OTPCode = undefined;
        // user.OTPCodeExpiryDate = undefined;
        // user.lastLoginAt = Date.now();

        await sendWelcomeEmail(user.email, user.full_name);
        return res.status(200).json({ success: true, message: "Account Verified successfully"});
    } catch (error) {
        console.error("Error in Verify controller", error);
        return res.status(500).json({ success: false, message: "The account verification has failed" });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await retrieveUser(user_id);
        if(!user)
            return res.status(404).json({ message: "User not found" });

        const email = user.email;
        await deleteUser(user_id);

        await sendAccountDeletedEmail(email);
        return res.status(200).json({ success: true, message: "Account deleted successfully"});
    } catch (error) {
        console.error("Error in deleteAccount controller", error);
        return res.status(500).json({ success: false, message: "The account deletion has failed" });
    }
}

const generateOTPCode = async (req, res) => {
    try {
        const { _id } = req.user;
        const user = await retrieveUser(_id);
        if(!user)
            return res.status(404).json({ message: "User not found" });

        const OTPCode = Math.floor(100000 + 900000 * Math.random());
        // const OTPCodeExpiryDate = Date.now() + 3 * 60 * 1000; // 3 minutes
        // should be saved in database

        await sendVerificationEmail(user.email, OTPCode);
        return res.status(201).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error in generateOTPCode controller", error);
        return res.status(500).json({ success: false, message: "The OTP generating process has failed" });
    }
}

const isAuthenticated = async (req, res) => {
    try {
        const { user_id } = req.user;
        const user = await retrieveUser(user_id);
        if(!user)
            return res.status(404).json({ success: false, message: "User not found" });
        return res.status(200).json({
            success: true, 
            user: { 
                ...user, 
                password_hash: undefined, 
                OTPCode: undefined, 
                OTPCodeExpiryDate: undefined, 
                refresh_token: undefined 
            } 
        });
    } catch (error) {
        console.error("Error in isAuthenticated controller", error);
        return res.status(500).json({ success: false, message: "The authentication process has failed" });
    }
}

export {
    register,
    login,
    logout,
    deleteAccount,
    verifyOTP,
    generateOTPCode,
    isAuthenticated,
};

