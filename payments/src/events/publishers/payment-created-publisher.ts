import {
  Subjects,
  Publisher,
  PaymentCreatedEvent,
} from '@itemseller/commonlib';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
