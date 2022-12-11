import { Publisher, Subjects, ItemUpdatedEvent } from '@itemseller/commonlib';

export class ItemUpdatedPublisher extends Publisher<ItemUpdatedEvent> {
  subject: Subjects.ItemUpdated = Subjects.ItemUpdated;
}
