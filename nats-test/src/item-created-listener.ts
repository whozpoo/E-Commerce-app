import { Message } from 'node-nats-streaming';

import { Listener } from '../../commonlib/src/events/base-listener';
import { ItemCreatedEvent } from '../../commonlib/src/events/item-created-event';
import { Subjects } from '../../commonlib/src/events/subjects';

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  readonly subject: Subjects.ItemCreated = Subjects.ItemCreated;
  queueGroupName = 'payments-service';
  onMessage(data: ItemCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);
    msg.ack();
  }
}
