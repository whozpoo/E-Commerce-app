import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Item } from '../../models/item';

it('returns error if one user tries to fetch another users order', async () => {
  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'itemOne',
    price: 20,
  });
  await item.save();

  const user = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ itemId: item.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
