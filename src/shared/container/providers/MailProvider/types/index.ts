export interface ISendMailDTO {
  to: string;
  subject: string;
  body?: string;
  variables?: any;
  path?: string;
}
