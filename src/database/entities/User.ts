import { v4 as uuid } from 'uuid';

class User {
  id?: string;
  gh_username!: string;
  name!: string;
  email!: string;
  password!: string;
  type?: 'user' | 'admin' | 'moderator';
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
    if (!this.type) {
      this.type = 'user';
    }
  }
}

export { User };
