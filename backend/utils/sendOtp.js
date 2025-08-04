export const sendOtp = async (email, otp) => {
    console.log(`OTP sent to ${email}: ${otp}`);
    // In production: send via nodemailer / SMS gateway
};
