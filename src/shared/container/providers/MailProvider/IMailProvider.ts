import { ISendMailDTO } from './types';

export interface IMailProvider {
  sendMail({ to, subject, body }: ISendMailDTO): Promise<void>;
}
