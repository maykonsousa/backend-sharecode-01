import { IMailProvider } from '../IMailProvider';
import { ISendMailDTO } from '../types';

export class MailProviderInMemory implements IMailProvider {
  private mails: ISendMailDTO[] = [];
  async sendMail({ to, subject, body }: ISendMailDTO): Promise<void> {
    this.mails.push({ to, subject, body });
  }
}
