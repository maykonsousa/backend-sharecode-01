import { v4 as uuid } from 'uuid';

class Token {
  id?: string;
  token?: string;
  user_id?: string;
  type?: string;
  is_revoked?: boolean;
  expires_at?: Date;
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
