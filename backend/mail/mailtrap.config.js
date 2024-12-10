import { MailtrapClient } from "mailtrap";
import "dotenv/config";

export const mailTrapClient = new MailtrapClient({ token: process.env.MAILTRAP_TOKEN });

export const sender = {
    email: "hello@fastfoodcorner.hu",
    name: "Reent",
};