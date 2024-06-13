import nodemailer from "nodemailer";
var Email = require("email-templates");
import  constants  from "./constants";

global.__basedir = `${__dirname}/`
class Emailer {
    public async sendMail (toEmail : string, mailSubject : string, templateName:string, locale:Object) : Promise<any> {
        try {
            locale = { ...locale, companyEmail: constants.NODEMAILER.SENDER_EMAIL }

            if (process.env.SEND_EMAIL === "true") {
                const configOption = {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: false,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASSWORD,
                    },
                };
                const viewPath =  constants.EMAIL_PATH ;

                console.log("viewPath ; ", viewPath);
                const transporter = nodemailer.createTransport(configOption);
                const email = new Email({
                    transport: transporter,
                    send: true,
                    preview: false,
                    views: {
                        options: {
                            extension: "ejs",
                        },
                        root: viewPath,
                    },
                    // preview: {
                    //     open: {
                    //       app: 'chrome',
                    //       wait: false
                    //     }
                    //   }
                });

                const renderedContent = await email.render(`${templateName}` , locale);
                // return
                let info;
                // send mail with defined transport object
                info = await email.send({
                    template: false,
                    message: {
                        from: constants.NODEMAILER.SENDER_EMAIL,
                        to: toEmail,
                        subject: mailSubject,
                        html: renderedContent,
                    },
                });

                if (info) console.log("Mail sent : ", info);
                return  { status: true, info };
            } else {
                return true;
            }
        } catch (error) {
            console.log("errorOccured", error);
            return { status: false, error: error };
        }
    }


}

export default new Emailer;
