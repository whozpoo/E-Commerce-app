import { Listener, OrderCreatedEvent, Subjects } from '@itemseller/commonlib';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import { Item } from '../../models/item';
import { ItemUpdatedPublisher } from '../publishers/item-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const item = await Item.findById(data.item.id);

    if (!item) {
      throw new Error('Item not found');
    }

    item.set({ orderId: data.id });

    await item.save();
    await new ItemUpdatedPublisher(this.client).publish({
      id: item.id,
      title: item.title,
      price: item.price,
      userId: item.userId,
      orderId: item.orderId,
      version: item.version,
    });

    msg.ack();
  }
}
