import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'abc@rrrrr.com',
      password: '98hufaskjnf',
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdfasd',
      password: 'asdfsadf',
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdfasd',
      password: 'p',
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdf@asdf.com',
    })
    .expect(400);

  await request(app)
    .post('/api/users/signup')
    .send({
      password: 'asdfasdfasdf',
    })
    .expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdf@asdf.com',
      password: 'asdfasdfasdf',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdf@asdf.com',
      password: 'asdfasdfa',
    })
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'asdf@asdf.com',
      password: 'asdfasdf',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
