import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@itemseller/commonlib';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-listener';
import { Item } from '../../../models/item';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const item = Item.build({
    title: 'ticket',
    price: 20,
    userId: 'asdf',
  });
  item.set({ orderId });
  await item.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    item: {
      id: item.id,
    },
  };

  // @ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };

  return { listener, item, data, message, orderId };
};

it('updates the item, publishes an event, and acks the message', async () => {
  const { listener, item, data, message, orderId } = await setup();

  await listener.onMessage(data, message);

  const updatedItem = await Item.findById(item.id);

  expect(updatedItem!.orderId).not.toBeDefined();
  expect(message.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
