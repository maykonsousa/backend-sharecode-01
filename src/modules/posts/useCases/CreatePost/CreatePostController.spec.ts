/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

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
};

let user: User;
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

  it('should be able to create a post', async () => {
    const response = await request(app)
      .post('/posts')
      .send({ ...postData, user_id: user.id })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(201);
    expect(response.body.user_id).toBe(user.id);
    expect(response.body.yt_url).toBe(postData.yt_url);
    expect(response.body.title).toBe(postData.title);
  });

  it('Should not be able to create a post by not authenticated', async () => {
    const response = await request(app).post('/posts').send(postData);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token not provided');
  });

  it('Should not be able to create a post with invalid token', async () => {
    const response = await request(app)
      .post('/posts')
      .set('Authorization', 'Bearer invalid-token')
      .send(postData);
    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token invalid');
  });

  //post already exists
  it('Should not be able to create a post with a post already exists', async () => {
    await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);
    const response = await request(app)
      .post('/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(postData);
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Post already exists');
  });
});
