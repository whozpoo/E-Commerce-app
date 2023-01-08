import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ItemUpdatedEvent } from '@itemseller/commonlib';
import { ItemUpdatedListener } from '../item-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Item } from '../../../models/item';

const setup = async () => {
  const listener = new ItemUpdatedListener(natsWrapper.client);

  const item = Item.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'dvd',
    price: 25,
  });
  await item.save();

  const data: ItemUpdatedEvent['data'] = {
    id: item.id,
    version: item.version + 1,
    title: 'newdvd',
    price: 30,
    userId: 'asdf',
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, msg, item };
};

it('finds, updates, and saves an item', async () => {
  const { listener, data, msg, item } = await setup();

  await listener.onMessage(data, msg);

  const updatedItem = await Item.findById(item.id);

  expect(updatedItem!.title).toEqual(data.title);
  expect(updatedItem!.price).toEqual(data.price);
  expect(updatedItem!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
