import request from 'supertest';
import { app } from '../../../../shared/http/app';

describe('[e2e] - CreateUserController', () => {
  it('should create a user', async () => {
    const response = await request(app).post('/users').send({
      gh_username: 'maykonsousa',
      name: 'Maykon Sousa',
      email: 'maykon.sousa@hotmail.com',
      password: '123456',
    });
    console.log(response.body);
  });
});
