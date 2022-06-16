import { v4 as uuid } from 'uuid';

class Token {
  id?: string;
  user_id!: string;
  token!: string;
  is_revoked!: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.is_revoked = false;
    }
  }
}

export { Token };
