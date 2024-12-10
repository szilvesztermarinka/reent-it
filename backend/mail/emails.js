import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailTrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email verification",
        });

        console.log("Email sent succesfully", response);
    } catch (error) {
        console.log(`Error sending verification ${error}`);
        throw new Error(`Error sending verification email: ${error}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset",
        });
    } catch (error) {
        console.log(`Error sending password reset ${error}`);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};


export const sendResetSuccessEmail = async (email) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Password reset", 
        })

        console.log("Password reset email sent succesfully", response);
    } catch (error) {
        console.log(`Error sending password reset ${error}`);
        throw new Error(`Error sending password reset email: ${error}`);
    }
}

export const sendWelcomeEmail = async (email, name) => {
    const recipient = [{ email }];

    try {
        const response = await mailTrapClient.send({
            from: sender,
            to: recipient,
            subject: "Email verify was Successful",
            html: `<h1>Verifying was succesfully, ${name}</h1>`,
            category: "Password reset", 
        })

        console.log("Password reset email sent succesfully", response);
    } catch (error) {
        console.log(`Error sending password reset ${error}`);
        throw new Error(`Error sending password reset email: ${error}`);
    }
}