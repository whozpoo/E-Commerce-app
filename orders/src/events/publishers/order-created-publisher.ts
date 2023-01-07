import { Publisher, OrderCreatedEvent, Subjects } from '@itemseller/commonlib';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
