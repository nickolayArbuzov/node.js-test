import * as nodemailer from "nodemailer";

export const sendEmail = async (email: string, code: string) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
      user: 'nickarb10888@gmail.com',
      pass: 'treecyvaqtxnhmzs',
    }
  })

  const emailTemplate = (code: string) => `<h1>Thank for your registration</h1>
      <p>To finish registration please follow the link below:
        <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
     </p>`
 
  await transporter.sendMail({
    from: 'nickarb10888@gmail.com',
    to: email,
    html: emailTemplate(code),
    subject: 'Регистрация',
  })

}