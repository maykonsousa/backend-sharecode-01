/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { Post } from 'database/entities/Post';
import { User } from 'database/entities/User';
import { app } from 'shared/http/app';
import request from 'supertest';

const userData = {
  gh_username: 'gh_username',
  name: 'Name Test',
  email: 'email@teste.com.br',
  password: '123456',
};

const postData = {
  yt_url: 'https://www.youtube.com/watch?v=bOdrGg5oc3E',
  title: 'Algumas Dicas de CSS - Willian Justen',
  description:
    'Willian Faz uma revisão de um código CSS dando dicas fundamentais',
  is_private: true,
  is_active: true,
};

let user: User;
let post: Post;
let token: string;

describe('CreatePostController', () => {
  beforeAll(async () => {
    const userCreated = await request(app).post('/users').send(userData);
    const tokenData = await request(app).post('/auth').send({
      email: userData.email,
      password: userData.password,
    });
    token = tokenData.body.token;
    user = userCreated.body;
  });

  it('should be able to find an active post', async () => {
    const postCreated = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);
    const postFound = await request(app)
      .get(`/posts/${postCreated.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(postFound.body).toMatchObject(postCreated.body);
  });

  it('should not be able to find an inactive post', async () => {
    const postCreated = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...postData, is_active: false });
    const postFound = await request(app)
      .get(`/posts/${postCreated.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(postFound.body).toEqual({ error: 'Post not found' });
  });

  it('should not be able to find a post with a wrong id', async () => {
    const postFound = await request(app)
      .get(`/posts/123`)
      .set('Authorization', `Bearer ${token}`)
      .send();
    expect(postFound.body).toEqual({ error: 'Post not found' });
  });
});
