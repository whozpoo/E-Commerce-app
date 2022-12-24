import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import { Order, OrderStatus } from '../../models/order';

const buildItem = async () => {
  const item = Item.build({
    title: 'itemOne',
    price: 20,
  });
  await item.save();
  return item;
};

it('fetches orders for an particular user', async () => {
  // Create three items
  const itemOne = await buildItem();
  const itemTwo = await buildItem();
  const itemThree = await buildItem();

  const userOne = global.signin();
  const userTwo = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ itemId: itemOne.id })
    .expect(201);

  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ itemId: itemTwo.id })
    .expect(201);
  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ itemId: itemThree.id })
    .expect(201);

  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

  expect(response.body.length).toEqual(2);
});
