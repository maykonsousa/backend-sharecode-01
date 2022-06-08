export interface ICreateUserDTO {
  gh_username: string;
  name: string;
  email: string;
  password: string;
}

export interface IUpdateUserDTO {
  gh_username?: string;
  name?: string;
  email?: string;
  password?: string;
}
