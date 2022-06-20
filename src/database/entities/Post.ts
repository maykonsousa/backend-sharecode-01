import { v4 as uuid } from 'uuid';

class Post {
  id!: string;
  yt_url!: string;
  title!: string;
  description!: string;
  is_private!: boolean;
  is_active!: boolean;
  user_id!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
      this.is_active = false;
      this.is_private = false;
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }
  }
}

export { Post };
