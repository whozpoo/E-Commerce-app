import { Message } from 'node-nats-streaming';
import { Subjects, Listener, ItemUpdatedEvent } from '@itemseller/commonlib';
import { Item } from '../../models/item';
import { queueGroupName } from './queue-group-name';

export class ItemUpdatedListener extends Listener<ItemUpdatedEvent> {
  subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: ItemUpdatedEvent['data'], msg: Message) {
    const item = await Item.findById(data);

    if (!item) {
      throw new Error('Item not found');
    }

    const { title, price } = data;
    item.set({ title, price });
    await item.save();

    msg.ack();
  }
}
