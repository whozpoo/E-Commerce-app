import { ItemCreatedEvent } from '@itemseller/commonlib';
import { ItemCreatedListener } from '../item-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Item } from '../../../models/item';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

const setup = async () => {
  const listener = new ItemCreatedListener(natsWrapper.client);

  const data: ItemCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'dvd',
    price: 25,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('create and saves an item', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const item = await Item.findById(data.id);

  expect(item).toBeDefined();
  expect(item!.title).toEqual(data.title);
  expect(item!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
