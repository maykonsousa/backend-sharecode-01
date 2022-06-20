/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from 'shared/http/app';
import request from 'supertest';

const userData = {
  gh_username: 'gh_username',
  name: 'Name Test',
  email: 'email@teste.com.br',
  password: '123456',
};

describe('AuthenticateUserController', () => {
  beforeAll(async () => {
    await request(app).post('/users').send(userData);
  });

  it('Should  be able to authenticate a user ', async () => {
    const response = await request(app).post('/auth').send({
      email: userData.email,
      password: userData.password,
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Should not be able to authenticate a user with wrong email/password', async () => {
    const response = await request(app).post('/auth').send({
      email: userData.email,
      password: 'wrong_password',
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: 'Invalid credentials' });
  });

  it('Should not be able to authenticate a user without password/email', async () => {
    const response = await request(app).post('/auth').send();

    expect(response.status).toBe(401);
  });
});
