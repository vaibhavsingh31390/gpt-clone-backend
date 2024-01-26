const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

module.exports = class Email {
  constructor() {
    this.from = process.env.MAIL_FROM;
    this.to = process.env.EMAIL_USERNAME;
    this.fromName = `CHAT GPT | FREE CREDIT REQ`;
    this.templateDir = path.join(__dirname, "../Views/EmailTemplates");
  }

  createTransporter() {
    if (process.env.NODE_ENV === "production") {
      //SENDGRID or any other production transporter setup
      return 1;
    } else {
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
        from: this.fromName,
      });
    }
  }

  async send(template, mailSubject, data) {
    const templateFile = path.join(this.templateDir, `${template}.ejs`);
    const emailOptions = {
      from: this.fromName,
      to: this.to,
      subject: mailSubject,
    };
    data.subject = mailSubject;
    try {
      const html = await ejs.renderFile(templateFile, {
        data,
      });
      emailOptions.html = html;
      // emailOptions.text = htmlToText.convert(html);
      const status = await this.createTransporter().sendMail(emailOptions);
      if (status) {
        console.log("Email Sent");
        return true;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return false;
    }
  }

  async sendMessage(data, templateName, subject) {
    const response = await this.send(templateName, subject, data);
    if (response) {
      return true;
    } else {
      return false;
    }
  }
};
