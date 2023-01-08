import { Listener, OrderCancelledEvent, Subjects } from '@itemseller/commonlib';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Item } from '../../models/item';
import { ItemUpdatedPublisher } from '../publishers/item-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const item = await Item.findById(data.item.id);

    if (!item) {
      throw new Error('Item not found');
    }

    item.set({ orderId: undefined });
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
