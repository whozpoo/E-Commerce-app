import { OrderCreatedEvent, OrderStatus } from '@itemseller/commonlib';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Item } from '../../../models/item';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const item = Item.build({
    title: 'apple',
    price: 1,
    userId: 'asdf',
  });
  await item.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'asdf',
    item: {
      id: item.id,
      price: item.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, item, data, msg };
};

it('sets the userId of the item', async () => {
  const { listener, item, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedItem = await Item.findById(item.id);

  expect(updatedItem!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, item, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('published a ticket updated event', async () => {
  const { listener, item, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
