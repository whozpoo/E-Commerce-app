import {
  Publisher,
  OrderCancelledEvent,
  Subjects,
} from '@itemseller/commonlib';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
