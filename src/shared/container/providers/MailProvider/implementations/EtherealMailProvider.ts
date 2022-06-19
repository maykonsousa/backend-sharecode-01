import { IMailProvider } from '../IMailProvider';
import { ISendMailDTO } from '../types';
import nodemailer, { Transporter } from 'nodemailer';

export class EtherealMailProvider implements IMailProvider {
  private client!: Transporter;
  constructor() {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const tranporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });
        this.client = tranporter;
      })
      .catch((err) => console.error(err));
  }
  async sendMail({ to, subject, body }: ISendMailDTO): Promise<void> {
    const message = await this.client.sendMail({
      to,
      from: 'ShareCode <contato@sharecode.com.br>',
      subject,
      html: body,
      text: body,
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}
