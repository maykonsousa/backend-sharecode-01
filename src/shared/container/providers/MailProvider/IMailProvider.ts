import { ISendMailDTO } from './types';

export interface IMailProvider {
  sendMail({ to, subject, variables, path }: ISendMailDTO): Promise<void>;
}
