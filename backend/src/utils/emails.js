import transporter from "../config/nodemailer.js"
import {
    WELCOME_EMAIL_TEMPLATE,
    OTP_VERIFICATION_EMAIL_TEMPLATE,
    ACCOUNT_DELETED_TEMPLATE
} from "./templates.js"

const sendTestEmail = async () => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_SENDER,
            to: "muhammad.bakr2005@gmail.com",
            subject: "Test Email",
            html: "<h1>Hello World</h1>"
        });
        console.log({ info });
    }
    catch (error) {
        console.log(error);
    }
}

const sendVerificationEmail = async (email, OTPCode) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_SENDER,
            to: email,
            subject: "Verify Your Email",
            html: OTP_VERIFICATION_EMAIL_TEMPLATE(OTPCode)
        });
        // console.log({ info });
    }
    catch (error) {
        console.log(error);
    }
}

const sendWelcomeEmail = async (email, full_name) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_SENDER,
            to: email,
            subject: "Welcome to our platform",
            html: WELCOME_EMAIL_TEMPLATE(full_name)
        });
        // console.log({ info });
    }
    catch (error) {
        console.log(error);
    }
}

const sendAccountDeletedEmail = async (email) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_SENDER,
            to: email,
            subject: "Your account has been deleted",
            html: ACCOUNT_DELETED_TEMPLATE()
        });
        // console.log({ info });
    }
    catch (error) {
        console.log(error);
    }
}

export {
    sendTestEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
    sendAccountDeletedEmail,
}