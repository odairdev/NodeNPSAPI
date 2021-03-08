import nodemailer, { Transporter } from 'nodemailer'
import handleBars from 'handlebars'
import fs from 'fs'

interface VariablesDTO {
  name: string;
  title: string;
  description: string;
  id?: string;
  link?: string;
}

class SendMailService {

    private client: Transporter

    constructor() {
        nodemailer.createTestAccount().then(account => {
          const transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
              user: account.user,
              pass: account.pass
            }
          })

          this.client = transporter;
        });
      }

    async execute(to: string, variables: VariablesDTO, path: string) {
        const templateFileContent = fs.readFileSync(path).toString("utf8")

        const mailTemplateParse = handleBars.compile(templateFileContent)

        const html = mailTemplateParse(variables)
    
        const message = await this.client.sendMail({
            to,
            subject: variables.title,
            html,
            from: "NPS <noreply@nps.com>"
        })

        console.log('Message sent: %s', message.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
    }
}

export default new SendMailService();