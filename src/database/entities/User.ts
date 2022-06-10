import { v4 as uuid } from 'uuid';

class User {
  id?: string;
  gh_username!: string;
  name!: string;
  email!: string;
  password!: string;
  is_admin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.is_admin = false;
    }
  }
}

export { User };
