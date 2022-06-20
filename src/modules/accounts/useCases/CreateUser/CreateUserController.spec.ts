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

describe('CreateUserController', () => {
  it('Should  be able to create a new user ', async () => {
    const response = await request(app).post('/users').send(userData);
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });

  it('Should not be able to create a new user with a duplicate email', async () => {
    await request(app).post('/users').send(userData);
    const response = await request(app).post('/users').send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'User already exists' });
  });
});
