import { OrderStatus, ExpirationCompleteEvent } from '@itemseller/commonlib';
import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Order } from '../../../models/order';
import { Item } from '../../../models/item';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'asdf',
    price: 10,
  });
  await item.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: new Date(),
    item,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, item, data, msg };
};

it('updates the order status to cancelled', async () => {
  const { listener, order, item, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an orderCancelledEvent', async () => {
  const { listener, order, item, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it('ack the msg', async () => {
  const { listener, order, item, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
