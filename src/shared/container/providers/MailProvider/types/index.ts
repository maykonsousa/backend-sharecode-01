export interface ISendMailDTO {
  to: string;
  subject: string;
  variables?: any;
  path: string;
}
