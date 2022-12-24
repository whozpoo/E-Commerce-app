import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Item } from '../../models/item';
import { Order, OrderStatus } from '../../models/order';

it('returns an error if the ticket does not exist', async () => {
  const itemId = new mongoose.Types.ObjectId();
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const item = Item.build({
    title: 'asdf',
    price: 20,
  });
  await item.save();
  const order = Order.build({
    item,
    userId: 'asdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  const item = Item.build({
    title: 'asdf',
    price: 20,
  });
  await item.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ itemId: item.id })
    .expect(201);
});

it.todo('emits an order created event');
