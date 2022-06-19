/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { app } from '../../../../shared/http/app';
import request from 'supertest';

const userData = {
  gh_username: 'gh_username',
  name: 'Name Test',
  email: 'email@teste.com.br',
  password: '123456',
};

const nodemailer = require('nodemailer');
jest.mock('nodemailer');
const sendMailMock = jest.fn();
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

describe('ForgotPasswordController', () => {
  beforeAll(async () => {
    await request(app).post('/users').send(userData);
  });

  beforeEach(() => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
  });

  it('Should  be able to send a recovery e-mail', async () => {
    const response = await request(app)
      .post('/password/forgot')
      .send({ email: userData.email });
    console.log(response.body);
  });
});
