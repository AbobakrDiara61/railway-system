import transporter from "../config/nodemailer.js"

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

export {
    sendTestEmail,
}