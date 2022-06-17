export interface ICreateUserDTO {
  gh_username: string;
  name: string;
  email: string;
  password: string;
}

export interface IUpdateUserDTO {
  password?: string;
}

export interface ICreateTokenDTO {
  id?: string;
  token: string;
  user_id: string;
  expires_at: Date;
  type: 'refresh' | 'reset';
}
