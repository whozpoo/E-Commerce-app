import { Publisher, Subjects, ItemCreatedEvent } from '@itemseller/commonlib';

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
}
