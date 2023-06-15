import nodemailer from "nodemailer";
import { config } from "../config/config";

async function sendEmail(toMail: string, text: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.mail,
                pass: config.mailPass,
            },
        });

        const mailConfigs = {
            to: toMail,
            subject: "Account Verification Link",
            text: text,
        };

        transporter.sendMail(mailConfigs, (error, info) => {
            if (error) {
                console.log(error);
                return reject(
                    console.log(
                        `Can't send to this mail ${toMail}. We encountered an error: ${error.message}`
                    )
                );
            }

            return resolve(
                console.log(`Verification mail has been sent to ${toMail}`)
            );
        });
    });
}

export default sendEmail;
