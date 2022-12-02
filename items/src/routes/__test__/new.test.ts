import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';

it('has a route handler listening to /api/items for post requests', async () => {
  const response = await request(app).post('/api/items').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/items').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if no title or an invalid title is provided', async () => {
  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 15,
    })
    .expect(400);

  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      price: 15,
    })
    .expect(400);
});

it('returns an error if no price or an invalid price is provided', async () => {
  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
      price: -1,
    })
    .expect(400);

  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
    })
    .expect(400);
});

it('creates a item with valid inputs', async () => {
  let items = await Item.find({});
  expect(items.length).toEqual(0);

  await request(app)
    .post('/api/items')
    .set('Cookie', global.signin())
    .send({
      title: 'asdf',
      price: 20,
    })
    .expect(201);

  items = await Item.find({});
  expect(items.length).toEqual(1);
  expect(items[0].price).toEqual(20);
  expect(items[0].title).toEqual('asdf');
});
