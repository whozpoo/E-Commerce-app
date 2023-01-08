import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@itemseller/commonlib';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
